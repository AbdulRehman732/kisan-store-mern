const mongoose = require('mongoose');
const Account = require('../models/Account');
const AuditLog = require('../models/AuditLog');

/**
 * FinanceService handles complex financial operations.
 * It uses ACID transactions if a Replica Set is available, 
 * otherwise falls back to standard sequential updates for development.
 */
class FinanceService {
  /**
   * Safe Session Wrapper: Handles environments without Replica Sets (standalone MongoDB)
   */
  static async withSession(operations) {
    let session = null;
    
    // Detection logic for Replica Set
    const isReplicaSet = mongoose.connection.getClient()?.topology?.description?.type === 'ReplicaSetNoPrimary' || 
                         mongoose.connection.getClient()?.topology?.description?.type === 'ReplicaSetWithPrimary' ||
                         mongoose.connection.getClient()?.topology?.description?.servers?.size > 1;

    try {
      if (isReplicaSet) {
        session = await mongoose.startSession();
        session.startTransaction();
      }
    } catch (e) {
      console.warn('[FinanceService] Failed to start transaction, falling back to sequential execution.');
      session = null;
    }

    try {
      const result = await operations(session);
      if (session) await session.commitTransaction();
      return result;
    } catch (error) {
      if (session) await session.abortTransaction();
      throw error;
    } finally {
      if (session) session.endSession();
    }
  }

  /**
   * Transfer funds between two institutional accounts
   */
  static async transferFunds({ fromAccountId, toAccountId, amount, note, userId }) {
    return this.withSession(async (session) => {
      const opts = session ? { session } : {};
      const fromAccount = await Account.findById(fromAccountId).session(session || null);
      const toAccount = await Account.findById(toAccountId).session(session || null);

      if (!fromAccount || !toAccount) {
        throw new Error('One or both accounts not found');
      }

      if (fromAccount.balance < Number(amount)) {
        throw new Error(`Insufficient funds in ${fromAccount.name}`);
      }

      // Perform updates
      fromAccount.balance -= Number(amount);
      toAccount.balance += Number(amount);

      await fromAccount.save(opts);
      await toAccount.save(opts);

      // Record in Audit Log
      const auditData = {
        user: userId,
        action: 'ACCOUNT_TRANSFER',
        targetType: 'Account',
        targetId: fromAccount._id,
        details: { from: fromAccount.name, to: toAccount.name, amount, note }
      };

      if (session) {
        await AuditLog.create([auditData], opts);
      } else {
        await AuditLog.create(auditData);
      }

      return { fromAccount, toAccount };
    });
  }

  /**
   * Record a payment against an order and update institutional account balance
   */
  static async recordPayment({ orderId, amount, method, accountId, paidAt, reference, note, userId }) {
    const Order = require('../models/Order');
    return this.withSession(async (session) => {
      const opts = session ? { session } : {};
      const order = await Order.findById(orderId).session(session || null);
      if (!order) throw new Error('Order not found');

      const paymentEntry = {
        amount: Number(amount),
        method,
        paidAt: paidAt ? new Date(paidAt) : new Date(),
        reference: reference || '',
        note: note || '',
        recordedBy: userId
      };

      if (accountId) {
        const account = await Account.findById(accountId).session(session || null);
        if (!account) throw new Error('Account not found');
        paymentEntry.account = accountId;
        account.balance += Number(amount);
        await account.save(opts);
      }

      order.payments.push(paymentEntry);
      await order.save(opts);

      const auditData = {
        user: userId,
        action: 'PAYMENT_RECORDED',
        targetType: 'Order',
        targetId: order._id,
        details: { amount, method, orderId }
      };

      if (session) {
        await AuditLog.create([auditData], opts);
      } else {
        await AuditLog.create(auditData);
      }

      return order;
    });
  }

  /**
   * Void a payment and reverse the balance from the institutional account
   */
  static async voidPayment(orderId, paymentId, userId) {
    const Order = require('../models/Order');
    return this.withSession(async (session) => {
      const opts = session ? { session } : {};
      const order = await Order.findById(orderId).session(session || null);
      if (!order) throw new Error('Order not found');

      const payment = order.payments.id(paymentId);
      if (!payment) throw new Error('Payment entry not found');

      if (payment.account) {
        const account = await Account.findById(payment.account).session(session || null);
        if (account) {
          account.balance = Math.max(0, account.balance - payment.amount);
          await account.save(opts);
        }
      }

      const amountToVoid = payment.amount;
      payment.deleteOne();
      await order.save(opts);

      const auditData = {
        user: userId,
        action: 'PAYMENT_VOIDED',
        targetType: 'Order',
        targetId: order._id,
        details: { amount: amountToVoid, paymentId }
      };

      if (session) {
        await AuditLog.create([auditData], opts);
      } else {
        await AuditLog.create(auditData);
      }

      return order;
    });
  }
}

module.exports = FinanceService;
