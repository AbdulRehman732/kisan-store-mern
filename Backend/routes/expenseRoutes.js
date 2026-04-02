const express = require('express');
const router = express.Router();
const { getExpenses, createExpense, updateExpense, deleteExpense } = require('../controllers/expenseController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, adminOnly, getExpenses);
router.post('/', protect, adminOnly, createExpense);
router.put('/:id', protect, adminOnly, updateExpense);
router.delete('/:id', protect, adminOnly, deleteExpense);

module.exports = router;
