const mongoose = require("mongoose");
const Review = require("./Backend/models/Review");
const Product = require("./Backend/models/Product");
const User = require("./Backend/models/User");
require("dotenv").config({ path: "./Backend/.env" });

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/kisanstore_db";

async function seedProductionVerification() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for production verification");

    // 1. Get a product and a farmer
    const product = await Product.findOne();
    const farmer = await User.findOne({ role: "farmer" });

    if (product && farmer) {
      // 2. Clear existing reviews
      await Review.deleteMany({});
      
      // 3. Create dummy reviews
      const reviews = [
        {
          product: product._id,
          user: farmer._id,
          rating: 5,
          comment: "Operational Excellence! The urea quality is superior and delivery was punctual.",
          farmerName: farmer.first_name + " " + farmer.last_name
        },
        {
          product: product._id,
          user: farmer._id,
          rating: 4,
          comment: "Wait time was minimal. Professional service.",
          farmerName: farmer.first_name + " " + farmer.last_name
        }
      ];
      await Review.insertMany(reviews);
      console.log("✅ 2 Dummy reviews seeded for moderation check.");
    } else {
      console.log("⚠️ Could not find product or farmer. Seed the database first!");
    }

    // 4. Create a test staff account
    await User.findOneAndDelete({ email: "staff_test@kisanstore.pk" });
    await User.create({
      first_name: "Staff",
      last_name: "Technician",
      email: "staff_test@kisanstore.pk",
      password: "staffpassword123",
      role: "staff",
      emailVerified: true
    });
    console.log("✅ Staff account created: staff_test@kisanstore.pk / staffpassword123");

    process.exit(0);
  } catch (err) {
    console.error("Verification Seeder error:", err);
    process.exit(1);
  }
}

seedProductionVerification();
