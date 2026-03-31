const Product = require('../models/Product');
const Review = require('../models/Review');
const AuditLog = require('../models/AuditLog');
const mongoose = require('mongoose');

exports.getProducts = async (req, res) => {
  try {
    const { search, category, availability, minPrice, maxPrice, crop } = req.query;
    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    if (crop) query.crops = crop;
    if (availability === 'inStock') query.stock = { $gt: 0 };
    if (availability === 'outOfStock') query.stock = 0;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json({ products });
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
    const { name, category, price, unit, stock, description, brand, featured, tags, crops } = req.body;
    if (!name || !category || !price || !stock)
      return res.status(400).json({ message: 'Name, category, price and stock are required' });

    const imageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const product = await Product.create({
      name,
      category,
      price: Number(price),
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

    const { name, category, price, unit, stock, description, brand, featured, tags, crops } = req.body;
    const updateData = {
      name, category,
      price: Number(price),
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