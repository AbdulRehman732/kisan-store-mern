const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  storeName: {
    type: String,
    default: 'KisanStore ERP'
  },
  storeAddress: {
    type: String,
    default: 'Industrial Estate, Phase 1'
  },
  storePhone: {
    type: String,
    default: '0300-1234567'
  },
  logoUrl: {
    type: String,
    default: ''
  },
  footerText: {
    type: String,
    default: 'Thank you for choosing KisanStore — Supporting Sustainable Agriculture'
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
