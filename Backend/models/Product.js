const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    brand: { type: String, trim: true },
    isAvailable: { type: Boolean, default: true },
    description: { type: String, trim: true },
    category: { type: String, enum: ['Fertilizer', 'Seeds'], required: true },
    crops: { type: [String], default: [] },
    unit: { type: String, default: 'per bag' },
    image: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    priceHistory: [{
      price: { type: Number, required: true },
      date: { type: Date, default: Date.now }
    }],
  },
  { timestamps: true }
);

ProductSchema.pre('save', function (next) {
  this.isAvailable = this.stock > 0;
  next();
});

module.exports = mongoose.model('Product', ProductSchema);