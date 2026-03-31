const express = require('express');
const router = express.Router();
const { 
  getProducts, getFeaturedProducts, getProduct, createProduct, updateProduct, 
  deleteProduct, getReviews, addReview
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');
const { productValidator } = require('../middleware/validators');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);

router.get('/:id', getProduct);
router.post('/', protect, adminOnly, upload.array('images', 5), productValidator, validate, createProduct);
router.put('/:id', protect, adminOnly, upload.array('images', 5), productValidator, validate, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

// Review routes
router.get('/:id/reviews', getReviews);
router.post('/:id/reviews', protect, addReview);

module.exports = router;