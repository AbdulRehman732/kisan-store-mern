const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farmerPhone: { type: String, required: true },
    items: { type: [OrderItemSchema], required: true },
    status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' },
    totalAmount: { type: Number, min: 0 },
    pickupDate: { type: Date, required: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

OrderSchema.pre('save', function (next) {
  this.totalAmount = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  next();
});

module.exports = mongoose.model('Order', OrderSchema);