const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const AuditLog = require('../models/AuditLog');
const APIFeatures = require('../utils/apiFeatures');
const FinanceService = require('../services/FinanceService');
const OrderService = require('../services/OrderService');
const fs = require('fs');
const csv = require('csv-parser');
const MailService = require('../services/MailService');


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
      { $group: { _id: null, total: { $sum: '$grandTotal' } } }
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    const debtData = await Order.aggregate([
      { $match: { paymentStatus: { $in: ['Unpaid', 'Partial'] } } },
      { $group: { _id: null, total: { $sum: { $subtract: ['$grandTotal', '$amountPaid'] } } } }
    ]);
    const totalDebt = debtData[0]?.total || 0;

    res.json({
      stats: {
        totalProducts,
        totalFarmers,
        totalOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        lowStock,
        outOfStock,
        totalRevenue,
        totalDebt
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
    const features = new APIFeatures(User.find({ role: 'farmer' }).select('-password'), req.query)
      .search(['first_name', 'last_name', 'email', 'phone', 'cnic'])
      .filter()
      .sort()
      .paginate();

    const farmers = await features.query;
    
    // Total count for pagination metadata
    const totalCountFeatures = new APIFeatures(User.find({ role: 'farmer' }), req.query)
      .search(['first_name', 'last_name', 'email', 'phone', 'cnic'])
      .filter();
    const totalRecords = await totalCountFeatures.query.countDocuments();
    const limit = req.query.limit * 1 || 10;
    const totalPages = Math.ceil(totalRecords / limit);

    res.json({ 
      farmers,
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

exports.updateFarmerStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const farmer = await User.findById(req.params.id);
    if (!farmer) {
       return res.status(404).json({ message: 'User not found' });
    }
    
    farmer.isActive = isActive;
    await farmer.save();
    
    // Audit Log
    await AuditLog.create({
      user: req.user._id,
      action: 'UPDATE_USER_STATUS',
      targetType: 'User',
      targetId: farmer._id,
      details: { email: farmer.email, status: isActive ? 'Active' : 'Suspended' }
    });

    res.json({ message: 'User status updated', farmer });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: { $in: ['admin', 'manager'] } }).select('-password').sort({ createdAt: -1 });
    res.json({ staff });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createStaff = async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone, role, confirmAdminPassword } = req.body;
    
    // Verify admin identity
    const admin = await User.findById(req.user._id);
    const isMatch = await admin.matchPassword(confirmAdminPassword);
    if (!isMatch) return res.status(401).json({ message: 'Authorization failed: Administrative password incorrect' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    let avatarUrl = "";
    if (req.file) {
      avatarUrl = `/uploads/${req.file.filename}`;
    }

    const staff = await User.create({
      first_name, last_name, email, password, phone, role: role || 'admin', avatarUrl
    });

    res.status(201).json({ message: 'Administrative staff created', staff });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateStaff = async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone, role, confirmAdminPassword } = req.body;
    
    // Verify admin identity
    const admin = await User.findById(req.user._id);
    const isMatch = await admin.matchPassword(confirmAdminPassword);
    if (!isMatch) return res.status(401).json({ message: 'Authorization failed: Administrative password incorrect' });

    const staff = await User.findById(req.params.id);
    
    if (!staff || (staff.role !== 'admin' && staff.role !== 'manager')) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    if (email && email !== staff.email) {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: 'Email already in use' });
      staff.email = email;
    }

    if (first_name) staff.first_name = first_name;
    if (last_name) staff.last_name = last_name;
    if (role) staff.role = role;
    if (phone) {
      staff.phone = Array.isArray(phone) ? phone : [phone];
    }
    if (password) staff.password = password;
    
    if (req.file) {
      staff.avatarUrl = `/uploads/${req.file.filename}`;
    }

    await staff.save();
    res.json({ message: 'Staff profile updated', staff });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    const staff = await User.findById(req.params.id);
    if (!staff || (staff.role !== 'admin' && staff.role !== 'manager')) {
      return res.status(404).json({ message: 'Personnel not found' });
    }
    // Prevent deleting oneself
    if (staff._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot remove your own active session" });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Personnel securely removed' });
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
exports.updateFarmerStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user || user.role !== 'farmer') {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    user.isActive = isActive;
    await user.save();

    // Audit Log
    await AuditLog.create({
      user: req.user._id,
      action: isActive ? 'ACTIVATE_FARMER' : 'SUSPEND_FARMER',
      targetType: 'User',
      targetId: user._id,
      details: { email: user.email, status: isActive ? 'Active' : 'Suspended' }
    });

    res.json({ message: `Farmer account ${isActive ? 'activated' : 'suspended'} successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateFarmerProfile = async (req, res) => {
  try {
    const { first_name, last_name, phone, address, city, cnic } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user || user.role !== 'farmer') {
      return res.status(404).json({ message: 'Stakeholder not found' });
    }

    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.city = city || user.city;
    user.cnic = cnic || user.cnic;

    await user.save();

    // Audit Log
    await AuditLog.create({
      user: req.user._id,
      action: 'UPDATE_FARMER_PROFILE',
      targetType: 'User',
      targetId: user._id,
      details: { name: `${user.first_name} ${user.last_name}`, fields: Object.keys(req.body) }
    });

    res.json({ message: 'Stakeholder profile updated successfully', farmer: user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.recordPayment = async (req, res) => {
  try {
    const { amount, method, accountId, paidAt, reference, note } = req.body;
    
    // We need to fetch and populate order after updating it via recordPayment
    const orderRaw = await FinanceService.recordPayment({
      orderId: req.params.id,
      amount,
      method,
      accountId,
      paidAt,
      reference,
      note,
      userId: req.user._id
    });

    const order = await Order.findById(orderRaw._id).populate('farmer', 'first_name last_name email');

    // Notify farmer via institutional email (Mock)
    if (order && order.farmer && order.farmer.email) {
      await MailService.sendPaymentReceipt(order.farmer, order, { amount, method });
    }

    // Real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(order.farmer._id.toString()).emit('payment_update', { 
        orderId: order._id, 
        amount, 
        method,
        message: `A payment of Rs. ${amount.toLocaleString()} has been recorded for your order.` 
      });
      io.emit('admin_payment_update', { orderId: order._id, amount });
    }

    // Institutional Audit Log
    const AuditLog = require('../models/AuditLog');
    await AuditLog.create({
      user: req.user._id,
      action: 'PAYMENT_RECORDED',
      targetType: 'Order',
      targetId: order._id,
      details: { amount, method, accountId, reference, orderId: order._id }
    });

    res.json({ message: 'Payment recorded securely', order });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || 'Payment registration failed' });
  }
};

exports.voidPayment = async (req, res) => {
  try {
    const { id, paymentId } = req.params;
    const order = await FinanceService.voidPayment(id, paymentId, req.user._id);

    // Detailed Audit for Financial Reversal
    const AuditLog = require('../models/AuditLog');
    await AuditLog.create({
      user: req.user._id,
      action: 'PAYMENT_VOIDED',
      targetType: 'Order',
      targetId: order._id,
      details: { orderId: id, paymentId, reversedAmount: order.grandTotal - order.amountPaid } // Estimate
    });

    res.json({ message: 'Payment voided and balance reversed', order });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || 'Void operation failed' });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const Account = require('../models/Account');
    const { id, paymentId } = req.params;
    const { amount, method, accountId, paidAt, reference, note } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const payment = order.payments.id(paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment entry not found' });

    const newAmount = Number(amount);
    const oldAmount = payment.amount;
    const oldAccountId = payment.account ? payment.account.toString() : null;
    const newAccountId = accountId || null;

    // Reconciliation Logic
    if (oldAccountId === newAccountId) {
      if (oldAccountId) {
        const account = await Account.findById(oldAccountId);
        if (account) {
          account.balance += (newAmount - oldAmount); // Difference added to account (order payments represent income)
          await account.save();
        }
      }
    } else {
      if (oldAccountId) {
        const oldAccount = await Account.findById(oldAccountId);
        if (oldAccount) {
          oldAccount.balance -= oldAmount;
          await oldAccount.save();
        }
      }
      if (newAccountId) {
        const newAccount = await Account.findById(newAccountId);
        if (newAccount) {
          newAccount.balance += newAmount;
          await newAccount.save();
        }
      }
    }

    payment.amount = newAmount;
    payment.method = method || payment.method;
    payment.account = newAccountId || undefined;
    payment.paidAt = paidAt ? new Date(paidAt) : payment.paidAt;
    payment.reference = reference || '';
    payment.note = note || '';

    await order.save();

    // Reconciliation Audit
    const AuditLog = require('../models/AuditLog');
    await AuditLog.create({
      user: req.user._id,
      action: 'PAYMENT_RECONCILED',
      targetType: 'Order',
      targetId: order._id,
      details: { 
        orderId: id, 
        paymentId, 
        adjustment: newAmount - oldAmount,
        oldAccount: oldAccountId,
        newAccount: newAccountId
      }
    });

    res.json({ message: 'Payment updated and balances reconciled', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { items, pickupDate, farmerPhone, notes } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (items) {
      for (const item of order.items) {
        if (item.product) {
          await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
        }
      }
      for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) return res.status(404).json({ message: `Product ${item.product} not found` });
        product.stock -= item.quantity;
        await product.save();
      }
      order.items = items;
    }

    if (pickupDate) order.pickupDate = pickupDate;
    if (farmerPhone) order.farmerPhone = farmerPhone;
    if (notes !== undefined) order.notes = notes;

    await order.save();
    const populated = await Order.findById(order._id)
      .populate('farmer', 'first_name last_name email phone address city')
      .populate('items.product', 'name price category unit');

    res.json({ message: 'Invoice updated and stock reconciled', order: populated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createShopSale = async (req, res) => {
  try {
    const { farmerId, farmerPhone, items, notes, payment } = req.body;
    
    const saleData = {
      farmerId,
      farmerPhone,
      items,
      notes,
      totalAmount: items.reduce((acc, it) => acc + (it.price * it.quantity), 0),
      paymentStatus: (payment && Number(payment.amount) > 0) ? 'Partial' : 'Unpaid'
    };

    const order = await OrderService.createShopSale(saleData, req.user._id);

    // Record payment if provided
    if (payment && Number(payment.amount) > 0) {
      await FinanceService.recordPayment({
        orderId: order._id,
        amount: payment.amount,
        method: payment.method || 'Cash',
        accountId: payment.accountId,
        userId: req.user._id,
        note: 'Initial payment for shop sale'
      });
    }

    const populated = await Order.findById(order._id)
      .populate('farmer', 'first_name last_name')
      .populate('items.product', 'name price unit');

    res.status(201).json({ message: 'Atomic shop sale recorded', order: populated });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || 'Transaction aborted: Stock or financial validation failed' });
  }
};

exports.getFarmerCredit = async (req, res) => {
  try {
    const orders = await Order.find({ paymentStatus: { $in: ['Unpaid', 'Partial'] } })
      .populate('farmer', 'first_name last_name email phone')
      .populate('items.product', 'name');
    
    // Aggregate by farmer
    const debtMap = {};
    orders.forEach(o => {
      const fid = o.farmer?._id.toString();
      if (!fid) return;
      if (!debtMap[fid]) {
        debtMap[fid] = {
          farmer: o.farmer,
          totalDebt: 0,
          pendingOrders: []
        };
      }
      const due = (o.grandTotal || 0) - (o.amountPaid || 0);
      debtMap[fid].totalDebt += due;
      debtMap[fid].pendingOrders.push({
        _id: o._id,
        due,
        createdAt: o.createdAt,
        itemsSummary: o.items.map(i => i.product?.name).join(', ')
      });
    });

    res.json({ creditReport: Object.values(debtMap) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFarmerDetail = async (req, res) => {
  try {
    const farmer = await User.findById(req.params.id).select('-password');
    if (!farmer) return res.status(404).json({ message: 'Stakeholder entry not found' });

    const orders = await Order.find({ farmer: req.params.id })
      .populate('items.product', 'name price unit')
      .sort({ createdAt: -1 });

    const summary = {
      totalPurchased: 0,
      totalPaid: 0,
      totalBalance: 0,
      orderCount: orders.length,
      completedCount: 0,
      canceledCount: 0,
      pendingCount: 0
    };

    orders.forEach(o => {
      summary.totalPurchased += (o.grandTotal || 0);
      summary.totalPaid += (o.amountPaid || 0);
      if (o.status === 'Completed') summary.completedCount++;
      if (o.status === 'Cancelled') summary.canceledCount++;
      if (o.status === 'Pending') summary.pendingCount++;
    });
    summary.totalBalance = summary.totalPurchased - summary.totalPaid;

    res.json({ farmer, orders, summary });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};



