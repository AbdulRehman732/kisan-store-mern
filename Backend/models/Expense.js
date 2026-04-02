const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ['Supplies', 'Utilities', 'Salary', 'Rent', 'Transport', 'Marketing', 'Maintenance', 'Personal', 'Other'],
      default: 'Other'
    },
    method: { type: String, enum: ['Cash', 'Bank Transfer'], required: true },
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    spentAt: { type: Date, default: Date.now },
    note: { type: String, trim: true },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', ExpenseSchema);
