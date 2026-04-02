const mongoose = require('mongoose');

const TransferSchema = new mongoose.Schema(
  {
    fromAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    toAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    amount: { type: Number, required: true, min: 1 },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    note: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transfer', TransferSchema);
