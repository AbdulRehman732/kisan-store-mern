const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const soilRoutes = require('./routes/soilRoutes');
const accountRoutes = require('./routes/accountRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();

// ===== SECURITY MIDDLEWARE =====

// Security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'http://localhost:5000'],
    }
  }
}));

// CORS - only allow frontend
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Allow cookies to be sent
}));

// Cookie parser
app.use(cookieParser());

// Body parser
app.use(express.json({ limit: '10kb' }));

// Prevent NoSQL injection
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// General rate limit - Relaxed for local testing suite
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10000, // Increased for performance testing
  message: { message: 'Too many requests, please try again later' }
});
app.use('/api', limiter);

// Strict login rate limit - Relaxed for rapid test cycles
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // Increased for auth automation
  message: { message: 'Too many login attempts, please try again after 15 minutes' }
});
app.use('/api/auth/login', loginLimiter);

// ===== STATIC FILES =====
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== DATABASE =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// ===== ROUTES =====
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/soil', soilRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/expenses', expenseRoutes);

// ===== 404 HANDLER =====
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ===== GLOBAL ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// ===== SOCKET.IO =====
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log(`[SOCKET] Institutional client connected: ${socket.id}`);
  
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`[SOCKET] User ${userId} joined their dedicated channel`);
  });

  socket.on('disconnect', () => {
    console.log(`[SOCKET] Institutional client disconnected: ${socket.id}`);
  });
});