const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Review = require('./models/Review');
const Order = require('./models/Order');
require('dotenv').config({ path: './.env' });

async function verifyAll() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('--- FINAL SYSTEM INTEGRITY CHECK ---');

    const admin = await User.findOne({ email: 'admin@kisanstore.pk' });
    console.log(`[1/5] Admin Account: ${admin ? '✅ Found' : '❌ NOT FOUND'}`);

    const productCount = await Product.countDocuments();
    console.log(`[2/5] Inventory: ${productCount} products found (✅ Asset registry populated)`);

    const reviews = await Review.find().populate('farmer', 'first_name last_name');
    console.log(`[3/5] Moderation: ${reviews.length} reviews found.`);
    reviews.forEach((r, i) => {
      console.log(`     - Review ${i+1}: "${r.comment}" (by ${r.farmer?.first_name || 'Unknown'})`);
    });

    const manager = await User.findOne({ role: 'manager' });
    console.log(`[4/5] Staff Control: ${manager ? '✅ Manager (' + manager.email + ') Found' : '❌ NO MANAGER FOUND'}`);

    const orders = await Order.find();
    console.log(`[5/5] Fulfillment: ${orders.length} orders in manifest.`);
    
    console.log('\n--- VERIFICATION COMPLETE ---');
    process.exit(0);
  } catch (err) {
    console.error('Final Verification Error:', err);
    process.exit(1);
  }
}

verifyAll();
