const Order = require('../models/Order');
const OrderService = require('../services/OrderService');
const MailService = require('../services/MailService');
const APIFeatures = require('../utils/apiFeatures');
const mongoose = require('mongoose');

exports.createOrder = async (req, res) => {
  try {
    const { items, pickupDate, notes, farmerPhone } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ message: 'Order must have at least one item' });
    if (!pickupDate)
      return res.status(400).json({ message: 'Pickup date is required' });
    if (!farmerPhone)
      return res.status(400).json({ message: 'Phone number is required' });
    const order = await Order.create({
      farmer: req.user._id,
      items,
      pickupDate,
      notes,
      farmerPhone
    });

    // Notify farmer via institutional email (Mock)
    await MailService.sendOrderConfirmation(req.user, order);

    // Real-time notification
    const io = req.app.get('io');
    if (io) {
      io.emit('new_order', { orderId: order._id, farmerName: req.user.first_name });
    }

    res.status(201).json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ farmer: req.user._id })
      .populate('items.product', 'name price unit image')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const features = new APIFeatures(
      Order.find()
        .populate('farmer', 'first_name last_name email phone address city')
        .populate('items.product', 'name price category unit'), 
      req.query
    )
      .search(['status', 'farmerPhone', 'notes'])
      .filter()
      .sort()
      .paginate();

    const orders = await features.query;

    const totalCountFeatures = new APIFeatures(Order.find(), req.query)
      .search(['status', 'farmerPhone', 'notes'])
      .filter();
    const totalRecords = await totalCountFeatures.query.countDocuments();
    const limit = req.query.limit * 1 || 10;
    const totalPages = Math.ceil(totalRecords / limit);

    res.json({ 
      orders,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: req.query.page * 1 || 1,
        limit
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'Invalid order ID' });

    const order = await Order.findById(req.params.id)
      .populate('farmer', 'first_name last_name email phone address city')
      .populate('items.product', 'name price category unit');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    if (order.farmer._id.toString() !== req.user._id.toString() && req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Not authorized to view this invoice' });
    }

    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await OrderService.updateStatus(req.params.id, status, req.user._id);

    // Fetch full order for notification
    const fullOrder = await Order.findById(order._id).populate('farmer', 'first_name last_name email');
    
    if (fullOrder && fullOrder.farmer && fullOrder.farmer.email) {
      if (status === 'Completed' || status === 'Cancelled') {
        const subject = status === 'Completed' ? '📦 Procurement Ready: Order Completed' : '🛑 Procurement Alert: Order Cancelled';
        const html = `<h2>Order Status Update: ${status}</h2><p>Your order #${order._id.toString().slice(-8).toUpperCase()} has been ${status.toLowerCase()}.</p>`;
        await MailService.sendMail({ to: fullOrder.farmer.email, subject, html });
      }
    }

    // Real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(fullOrder.farmer._id.toString()).emit('order_update', { 
        orderId: order._id, 
        status: status,
        message: `Your procurement status has been updated to ${status}.` 
      });
      io.emit('admin_order_update', { orderId: order._id, status });
    }

    res.json({ order: fullOrder });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || 'Status update failed' });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await OrderService.updateStatus(req.params.id, 'Cancelled', req.user._id);
    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || 'Cancellation failed' });
  }
};
