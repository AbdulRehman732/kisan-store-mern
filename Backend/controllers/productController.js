const Product = require('../models/Product');
const Review = require('../models/Review');
const AuditLog = require('../models/AuditLog');
const APIFeatures = require('../utils/apiFeatures');
const mongoose = require('mongoose');
const { parseProductsCsv } = require('../utils/csvProcessor');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');

exports.getProducts = async (req, res) => {
  try {
    const features = new APIFeatures(Product.find(), req.query)
      .search(['name', 'brand', 'category', 'description'])
      .filter()
      .sort()
      .paginate();

    const products = await features.query;

    // Total count for pagination metadata
    const totalCountFeatures = new APIFeatures(Product.find(), req.query)
      .search(['name', 'brand', 'category', 'description'])
      .filter();
    const totalRecords = await totalCountFeatures.query.countDocuments();
    const limit = req.query.limit * 1 || 10;
    const totalPages = Math.ceil(totalRecords / limit);

    res.json({ 
      products,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: req.query.page * 1 || 1,
        limit
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true, stock: { $gt: 0 } }).limit(6);
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'Invalid product ID' });
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, category, price, unit, stock, description, brand, featured, tags, crops, taxAmount } = req.body;
    if (!name || !category || !price || !stock)
      return res.status(400).json({ message: 'Name, category, price and stock are required' });

    const imageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const product = await Product.create({
      name,
      category,
      price: Number(price),
      taxAmount: taxAmount ? Number(taxAmount) : 0,
      unit: unit || 'per bag',
      stock: Number(stock),
      description,
      brand,
      featured: featured === 'true' || featured === true,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean)) : [],
      crops: crops ? (Array.isArray(crops) ? crops : crops.split(',').map(t => t.trim()).filter(Boolean)) : [],
      image: imageUrls,
      priceHistory: [{ price: Number(price), date: new Date() }]
    });

    // Audit Log
    await AuditLog.create({
      user: req.user._id,
      action: 'CREATE_PRODUCT',
      targetType: 'Product',
      targetId: product._id,
      details: { name: product.name }
    });

    res.status(201).json({ product });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'Invalid product ID' });

    const { name, category, price, unit, stock, description, brand, featured, tags, crops, taxAmount } = req.body;
    const updateData = {
      name, category,
      price: Number(price),
      taxAmount: taxAmount !== undefined ? Number(taxAmount) : 0,
      unit,
      stock: Number(stock),
      description,
      brand,
      featured: featured === 'true' || featured === true,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean)) : [],
      crops: crops ? (Array.isArray(crops) ? crops : crops.split(',').map(t => t.trim()).filter(Boolean)) : []
    };
    
    if (req.files && req.files.length > 0) {
      updateData.image = req.files.map(file => `/uploads/${file.filename}`);
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Track price change
    if (Number(price) !== product.price) {
      product.priceHistory.push({ price: Number(price), date: new Date() });
    }

    // Update fields
    Object.assign(product, updateData);
    await product.save();

    // Audit Log
    await AuditLog.create({
      user: req.user._id,
      action: 'UPDATE_PRODUCT',
      targetType: 'Product',
      targetId: product._id,
      details: { name: product.name }
    });

    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'Invalid product ID' });

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Audit Log
    await AuditLog.create({
      user: req.user._id,
      action: 'DELETE_PRODUCT',
      targetType: 'Product',
      targetId: product._id,
      details: { name: product.name }
    });

    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.id })
      .populate('farmer', 'first_name last_name avatarUrl')
      .sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.create({
      product: req.params.id,
      farmer: req.user._id,
      rating,
      comment
    });

    // Audit Log
    await AuditLog.create({
      user: req.user._id,
      action: 'ADD_REVIEW',
      targetType: 'Review',
      targetId: review._id,
      details: { product: req.params.id, rating }
    });

    res.status(201).json({ review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.bulkUploadProducts = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please upload a CSV file' });

    // Use the path provided by multer (diskStorage)
    const filePath = req.file.path;

    const products = await parseProductsCsv(filePath);
    
    // Clean up file after parsing
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    if (products.length === 0) {
      return res.status(400).json({ message: 'No valid products found in CSV' });
    }

    const results = { created: 0, skipped: 0 };
    const savedProducts = [];

    for (const p of products) {
      const exists = await Product.findOne({ name: p.name, brand: p.brand });
      if (exists) {
        results.skipped++;
        continue;
      }
      
      // Ensure required fields
      if (!p.name || !p.category || isNaN(p.price)) {
        results.skipped++;
        continue;
      }

      const newProduct = new Product({
        ...p,
        priceHistory: [{ price: p.price, date: new Date() }]
      });
      savedProducts.push(newProduct);
      results.created++;
    }

    if (savedProducts.length > 0) {
      await Product.insertMany(savedProducts);
    }

    // Audit Log
    await AuditLog.create({
      user: req.user._id,
      action: 'BULK_UPLOAD_PRODUCTS',
      targetType: 'Product',
      details: { count: results.created, skipped: results.skipped }
    });

    res.json({ 
      success: true,
      message: `Bulk upload completed. Created: ${results.created}, Skipped: ${results.skipped}`,
      results 
    });
  } catch (err) {
    console.error('Bulk upload error:', err);
    res.status(500).json({ message: 'Server error during bulk upload' });
  }
};

exports.exportProductsCsv = async (req, res) => {
  try {
    const products = await Product.find().lean();
    
    const headers = [
      'name', 'category', 'price', 'taxAmount', 'stock', 'unit', 
      'brand', 'description', 'featured', 'isAvailable', 'crops', 'tags', 'image'
    ];

    let csvContent = headers.join(',') + '\n';

    products.forEach(p => {
      const row = headers.map(header => {
        let val = p[header];
        if (Array.isArray(val)) val = val.join(', ');
        if (typeof val === 'string') {
          val = val.replace(/"/g, '""');
          if (val.includes(',') || val.includes('"') || val.includes('\n')) {
            val = `"${val}"`;
          }
        }
        return val === undefined || val === null ? '' : val;
      });
      csvContent += row.join(',') + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=products_export.csv');
    res.status(200).send(csvContent);

    // Audit Log
    await AuditLog.create({
      user: req.user._id,
      action: 'EXPORT_PRODUCTS',
      targetType: 'Product',
      details: { count: products.length }
    });
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({ message: 'Server error during export' });
  }
};