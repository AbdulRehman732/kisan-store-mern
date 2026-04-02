const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const { getSettings, updateSettings, uploadLogo } = require('../controllers/settingsController');

router.get('/dashboard', protect, adminOnly, adminController.getDashboard);
router.get('/farmers', protect, adminOnly, adminController.getFarmers);
router.get('/farmers/:id/detail', protect, adminOnly, adminController.getFarmerDetail);
router.put('/farmers/:id', protect, adminOnly, adminController.updateFarmerProfile);
router.put('/farmers/:id/status', protect, adminOnly, adminController.updateFarmerStatus);
router.get('/staff', protect, adminOnly, adminController.getStaff);
router.post('/staff', protect, adminOnly, upload.single('avatar'), adminController.createStaff);
router.put('/staff/:id', protect, adminOnly, upload.single('avatar'), adminController.updateStaff);
router.delete('/staff/:id', protect, adminOnly, adminController.deleteStaff);
router.get('/reviews', protect, adminOnly, adminController.getAllReviews);
router.delete('/products/:productId/reviews/:reviewId', protect, adminOnly, adminController.deleteReview);
router.get('/audit-logs', protect, adminOnly, adminController.getAuditLogs);
router.get('/credit-report', protect, adminOnly, adminController.getFarmerCredit);
router.put('/orders/:id/status', protect, adminOnly, adminController.updateOrderStatus);
router.put('/orders/:id', protect, adminOnly, adminController.updateOrder);
router.post('/orders/shop-sale', protect, adminOnly, adminController.createShopSale);
router.post('/orders/:id/payment', protect, adminOnly, adminController.recordPayment);
router.put('/orders/:id/payment/:paymentId', protect, adminOnly, adminController.updatePayment);
router.delete('/orders/:id/payment/:paymentId', protect, adminOnly, adminController.voidPayment);
router.post('/products/bulk-upload', protect, adminOnly, upload.single('file'), adminController.bulkUploadProducts);

// System Settings & Branding
router.get('/settings', protect, adminOnly, getSettings);
router.put('/settings', protect, adminOnly, updateSettings);
router.post('/settings/logo', protect, adminOnly, upload.single('logo'), require('../middleware/uploadMiddleware').resizeImage, uploadLogo);

module.exports = router;
