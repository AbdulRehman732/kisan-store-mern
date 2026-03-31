const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const AuditLog = require('../models/AuditLog');
const fs = require('fs');
const csv = require('csv-parser');


exports.getDashboard = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalFarmers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const completedOrders = await Order.countDocuments({ status: 'Completed' });
    const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });

    // Low stock (<=5 and >0) and out of stock (0)
    const lowStock = await Product.countDocuments({ stock: { $gt: 0, $lte: 5 } });
    const outOfStock = await Product.countDocuments({ stock: 0 });

    const recentOrders = await Order.find()
      .populate('farmer', 'first_name last_name email phone')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 })
      .limit(5);

    // Monthly orders for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthlyChart = monthlyData.map(d => ({
      month: monthNames[d._id.month - 1],
      orders: d.orders,
      revenue: d.revenue
    }));

    // Top selling products
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          category: '$product.category',
          totalSold: 1,
          totalRevenue: 1
        }
      }
    ]);

    // Order status breakdown for pie chart
    const statusChart = [
      { name: 'Pending', value: pendingOrders, color: '#f5a623' },
      { name: 'Completed', value: completedOrders, color: '#4caf6e' },
      { name: 'Cancelled', value: cancelledOrders, color: '#e53935' },
    ];

    // Total revenue
    const revenueData = await Order.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    res.json({
      stats: {
        totalProducts,
        totalFarmers,
        totalOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        totalRevenue,
        lowStock,
        outOfStock
      },
      recentOrders,
      monthlyOrders: monthlyChart,
      statusBreakdown: statusChart,
      topProducts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFarmers = async (req, res) => {
  try {
    const farmers = await User.find({ role: 'farmer' }).select('-password').sort({ createdAt: -1 });
    res.json({ farmers });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: 'admin' }).select('-password').sort({ createdAt: -1 });
    res.json({ staff });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createStaff = async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const staff = await User.create({
      first_name, last_name, email, password, phone, role: 'admin'
    });

    res.status(201).json({ message: 'Administrative staff created', staff });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note, assignedTo } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status || order.status;
    if (assignedTo) order.assignedTo = assignedTo;
    
    order.statusHistory.push({
      status: status || order.status,
      note: note || 'Status updated by admin',
      changedAt: new Date()
    });

    await order.save();

    // Audit Log
    await AuditLog.create({
      user: req.user._id,
      action: 'UPDATE_ORDER_STATUS',
      targetType: 'Order',
      targetId: order._id,
      details: { status: order.status, note }
    });

    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const logs = await AuditLog.find()
      .populate('user', 'first_name last_name email')
      .sort({ createdAt: -1 })
      .limit(limit);
    // Reshape to include 'admin' field that the frontend expects
    const shaped = logs.map(l => ({
      ...l.toObject(),
      admin: l.user
    }));
    res.json({ logs: shaped });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.bulkUploadProducts = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const results = [];
    const filePath = req.file.path;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          // Robust Mapping
          const products = results.map(row => ({
            name: row.name || row.Name,
            category: row.category || row.Category || 'General',
            price: Number(row.price || row.Price || 0),
            unit: row.unit || row.Unit || 'per bag',
            stock: Number(row.stock || row.Stock || 0),
            brand: row.brand || row.Brand || 'Unknown',
            description: row.description || row.Description || '',
            featured: (row.featured || row.Featured) === 'true',
            tags: (row.tags || row.Tags) ? (row.tags || row.Tags).split(',').map(t => t.trim()) : []
          })).filter(p => p.name);

          if (products.length === 0) {
             if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
             return res.status(400).json({ message: 'No valid products found in CSV' });
          }

          await Product.insertMany(products);

          await AuditLog.create({
            user: req.user._id,
            action: 'BULK_UPLOAD_PRODUCTS',
            targetType: 'Product',
            details: { count: products.length, filename: req.file.originalname }
          });

          // Cleanup
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

          res.json({ message: `${products.length} products uploaded successfully`, count: products.length });
        } catch (innerErr) {
          console.error(innerErr);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          res.status(400).json({ message: 'Error processing CSV rows', error: innerErr.message });
        }
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const products = await Product.find().select('name reviews').populate('reviews.farmer', 'first_name last_name email');
    let allReviews = [];
    products.forEach(p => {
      if (p.reviews) {
        p.reviews.forEach(r => {
          allReviews.push({
            ...r.toObject(),
            productName: p.name,
            productId: p._id
          });
        });
      }
    });
    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ reviews: allReviews });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.reviews = product.reviews.filter(r => r._id.toString() !== reviewId);
    
    // Recalculate avg rating
    if (product.reviews.length > 0) {
      const sum = product.reviews.reduce((acc, r) => acc + r.rating, 0);
      product.avgRating = sum / product.reviews.length;
    } else {
      product.avgRating = 0;
    }

    await product.save();
    res.json({ message: 'Review successfully removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
