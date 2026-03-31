const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true // e.g., 'CREATE_PRODUCT', 'UPDATE_ORDER_STATUS'
  },
  targetType: {
    type: String,
    required: true // e.g., 'Product', 'Order'
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    optional: true
  },
  details: {
    type: Object,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
