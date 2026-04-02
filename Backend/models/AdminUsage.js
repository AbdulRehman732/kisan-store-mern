const mongoose = require('mongoose');

const AdminUsageSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['Personal', 'Charity', 'Office'], required: true },
    amount: { type: Number, default: 0 }, // Cash taken
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true },
        reason: String
      }
    ],
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }, // Source account if cash taken
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    note: { type: String, trim: true },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('AdminUsage', AdminUsageSchema);
