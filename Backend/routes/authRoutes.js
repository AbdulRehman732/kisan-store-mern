const express = require('express');
const router = express.Router();
const { login, register, getMe, updateProfile, refreshToken, logout, changePassword, updateCart, forgotPassword, resetPassword, uploadAvatar, sendTemplateEmail } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');
const { registerValidator, loginValidator } = require('../middleware/validators');

router.post('/login', loginValidator, validate, login);
router.post('/register', registerValidator, validate, register);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/cart', protect, updateCart);
router.put('/password', protect, changePassword);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/send-template-email', sendTemplateEmail);

module.exports = router;