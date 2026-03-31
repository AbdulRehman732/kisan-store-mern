const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Product = require("./models/Product");
const User = require("./models/User");
const Order = require("./models/Order");
const Review = require("./models/Review");
const AuditLog = require("./models/AuditLog");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/kisanstore_db";

const products = [
  {
    name: "Urea Fertilizer",
    category: "Fertilizer",
    price: 3500,
    unit: "per bag",
    stock: 100,
    brand: "Engro",
    description: "High nitrogen fertilizer for all crops",
    featured: true,
    tags: ["nitrogen", "wheat", "rabi"],
  },
  {
    name: "DAP Fertilizer",
    category: "Fertilizer",
    price: 9800,
    unit: "per bag",
    stock: 80,
    brand: "FFC",
    description: "Di-Ammonium Phosphate for root development",
    featured: true,
    tags: ["phosphate", "cotton", "kharif"],
  },
  {
    name: "SOP Fertilizer",
    category: "Fertilizer",
    price: 6200,
    unit: "per bag",
    stock: 60,
    brand: "Sarsabz",
    description: "Sulphate of Potash for fruit quality",
    featured: false,
    tags: ["potash", "sugarcane"],
  },
  {
    name: "CAN Fertilizer",
    category: "Fertilizer",
    price: 4100,
    unit: "per bag",
    stock: 90,
    brand: "Engro",
    description: "Calcium Ammonium Nitrate",
    featured: false,
    tags: ["calcium", "nitrogen"],
  },
  {
    name: "Wheat Seeds",
    category: "Seeds",
    price: 1800,
    unit: "per 40kg",
    stock: 50,
    brand: "NARC",
    description: "Certified wheat seeds - high yield variety",
    featured: true,
    tags: ["wheat", "rabi", "certified"],
  },
  {
    name: "Cotton Seeds",
    category: "Seeds",
    price: 2200,
    unit: "per bag",
    stock: 40,
    brand: "ICI",
    description: "BT Cotton seeds - pest resistant",
    featured: true,
    tags: ["cotton", "kharif", "bt"],
  },
  {
    name: "Rice Seeds",
    category: "Seeds",
    price: 2800,
    unit: "per 25kg",
    brand: "PARC",
    stock: 35,
    description: "Basmati 515 variety rice seeds",
    featured: false,
    tags: ["rice", "basmati", "kharif"],
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    await AuditLog.deleteMany({});
    console.log("Cleared existing data");

    const salt = await bcrypt.genSalt(12);
    const hashedAdminPassword = await bcrypt.hash("admin123", salt);
    const hashedFarmerPassword = await bcrypt.hash("farmer123", salt);

    // Create Admin
    await User.create({
      first_name: "Admin",
      last_name: "KisanStore",
      email: "admin@kisanstore.pk",
      password: "admin123",
      role: "admin",
      emailVerified: true
    });
    console.log("Admin created: admin@kisanstore.pk / admin123");

    // Create Products
    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products seeded`);

    // Create Farmers
    const farmersData = [
      {
        first_name: "Ali",
        last_name: "Ahmed",
        email: "ali@gmail.com",
        password: "farmer123",
        phone: ["0300-1234567"],
        role: "farmer",
        emailVerified: true
      },
      {
        first_name: "Tariq",
        last_name: "Khan",
        email: "tariq@gmail.com",
        password: "farmer123",
        phone: ["0301-7654321"],
        role: "farmer",
        emailVerified: true
      },
      {
        first_name: "Bilal",
        last_name: "Hussain",
        email: "bilal@gmail.com",
        password: "farmer123",
        phone: ["0321-7654321"],
        role: "farmer",
        emailVerified: true
      }
    ];

    const farmers = [];
    for (const data of farmersData) {
      const f = await User.create(data);
      farmers.push(f);
    }
    console.log(`Farmers created: Ali, Tariq, Bilal`);

    // Create Sample Order for Ali
    await Order.create({
      farmer: farmers[0]._id,
      farmerPhone: farmers[0].phone[0],
      pickupDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      notes: "Please pack properly.",
      items: [
        {
          product: createdProducts[0]._id,
          quantity: 2,
          price: createdProducts[0].price,
        }
      ],
      status: "Pending"
    });

    console.log("Sample orders seeded");
    console.log("Done!");
    process.exit(0);
  } catch (err) {
    console.error("Seeder error:", err);
    process.exit(1);
  }
}

seed();

