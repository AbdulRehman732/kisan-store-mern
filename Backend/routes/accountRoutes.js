const express = require('express');
const router = express.Router();
const { getAccounts, createAccount, deleteAccount, transferFunds, adminWithdraw } = require('../controllers/accountController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, adminOnly, getAccounts);
router.post('/', protect, adminOnly, createAccount);
router.post('/transfer', protect, adminOnly, transferFunds);
router.post('/withdraw', protect, adminOnly, adminWithdraw);
router.delete('/:id', protect, adminOnly, deleteAccount);

module.exports = router;
