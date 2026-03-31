const express = require('express');
const router = express.Router();
const { 
  getDashboard, getFarmers, getAuditLogs, updateOrderStatus, bulkUploadProducts,
  getStaff, createStaff, getAllReviews, deleteReview
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/dashboard', protect, adminOnly, getDashboard);
router.get('/farmers', protect, adminOnly, getFarmers);
router.get('/staff', protect, adminOnly, getStaff);
router.post('/staff', protect, adminOnly, createStaff);
router.get('/reviews', protect, adminOnly, getAllReviews);
router.delete('/products/:productId/reviews/:reviewId', protect, adminOnly, deleteReview);
router.get('/audit-logs', protect, adminOnly, getAuditLogs);
router.put('/orders/:id/status', protect, adminOnly, updateOrderStatus);
router.post('/products/bulk-upload', protect, adminOnly, upload.single('file'), bulkUploadProducts);

module.exports = router;
