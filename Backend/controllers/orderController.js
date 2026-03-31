const Order = require('../models/Order');
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
    const orders = await Order.find()
      .populate('farmer', 'first_name last_name email phone')
      .populate('items.product', 'name price unit')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'Invalid order ID' });

    const { status } = req.body;
    if (!['Pending', 'Completed', 'Cancelled'].includes(status))
      return res.status(400).json({ message: 'Invalid status' });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'Invalid order ID' });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.farmer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    if (order.status !== 'Pending')
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });

    order.status = 'Cancelled';
    await order.save();
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};