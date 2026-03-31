const express = require('express');
const router = express.Router();
const { getReports, addReport, deleteReport } = require('../controllers/soilController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getReports);
router.post('/', protect, addReport);
router.delete('/:id', protect, deleteReport);

module.exports = router;
