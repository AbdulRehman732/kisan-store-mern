const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['Cash', 'Bank'], required: true },
    bankName: { type: String, trim: true },
    accountNumber: { type: String, trim: true },
    balance: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Account', AccountSchema);
