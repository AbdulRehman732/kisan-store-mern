const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, enum: ['Cash', 'Bank Transfer'], required: true },
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    paidAt: { type: Date, default: Date.now },
    reference: { type: String, trim: true },
    note: { type: String, trim: true },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { _id: true }
);

const OrderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    taxAmount: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farmerPhone: { type: String, required: true },
    items: { type: [OrderItemSchema], required: true },
    status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' },
    statusHistory: [
      {
        status: String,
        note: String,
        changedAt: { type: Date, default: Date.now }
      }
    ],
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    totalAmount: { type: Number, min: 0 },
    taxTotal: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ['Unpaid', 'Partial', 'Paid'], default: 'Unpaid' },
    payments: [PaymentSchema],
    pickupDate: { type: Date, required: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

OrderSchema.pre('save', function (next) {
  this.totalAmount = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  this.taxTotal = this.items.reduce((sum, item) => sum + (item.taxAmount || 0) * item.quantity, 0);
  this.grandTotal = this.totalAmount + this.taxTotal;
  this.amountPaid = this.payments.reduce((sum, p) => sum + p.amount, 0);
  if (this.amountPaid >= this.grandTotal && this.grandTotal > 0) {
    this.paymentStatus = 'Paid';
  } else if (this.amountPaid > 0) {
    this.paymentStatus = 'Partial';
  } else {
    this.paymentStatus = 'Unpaid';
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema);