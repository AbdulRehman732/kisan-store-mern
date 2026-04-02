const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const AuditLog = require('../models/AuditLog');

/**
 * OrderService manages order lifecycles and retail operations using ACID transactions
 */
class OrderService {
  /**
   * Update order status and handle inventory/financial side effects
   */
  static async updateStatus(orderId, status, userId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await Order.findById(orderId).session(session);
      if (!order) throw new Error('Order not found');

      const oldStatus = order.status;
      order.status = status;

      // Logic for Completion (e.g. deductions if not already handled)
      // Logic for Cancellation (e.g. restocking)
      if (status === 'Cancelled' && oldStatus === 'Pending') {
        // Optional: Restock logic if items were reserved
      }

      await order.save({ session });

      await AuditLog.create([{
        user: userId,
        action: 'ORDER_STATUS_UPDATE',
        targetType: 'Order',
        targetId: order._id,
        details: { from: oldStatus, to: status }
      }], { session });

      await session.commitTransaction();
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Create a direct shop sale with immediate inventory deduction
   */
  static async createShopSale(saleData, userId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { farmerId, items, notes, totalAmount, paymentStatus } = saleData;

      // 1. Validate and Deduct Inventory
      for (const item of items) {
        const product = await Product.findById(item.product).session(session);
        if (!product) throw new Error(`Product ${item.product} not found`);
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
        }
        product.stock -= item.quantity;
        await product.save({ session });
      }

      // 2. Create Order
      const order = await Order.create([{
        farmer: farmerId,
        items,
        totalAmount,
        status: 'Completed',
        paymentStatus: paymentStatus || 'Pending',
        isShopSale: true,
        notes: notes || 'Direct Shop Sale'
      }], { session });

      // 3. Audit Log
      await AuditLog.create([{
        user: userId,
        action: 'SHOP_SALE_CREATED',
        targetType: 'Order',
        targetId: order[0]._id,
        details: { items: items.length, total: totalAmount }
      }], { session });

      await session.commitTransaction();
      return order[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

module.exports = OrderService;
