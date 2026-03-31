const { body } = require('express-validator');

exports.registerValidator = [
  body('first_name').trim().notEmpty().withMessage('First name is required'),
  body('last_name').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('phone').notEmpty().withMessage('Phone number is required'),
];

exports.loginValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.productValidator = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('category').isIn(['Fertilizer', 'Seeds']).withMessage('Invalid category'),
  body('price').isNumeric().isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('stock').isNumeric().isInt({ min: 0 }).withMessage('Valid stock is required'),
];

exports.orderValidator = [
  body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
  body('pickupDate').notEmpty().withMessage('Pickup date is required'),
  body('farmerPhone').notEmpty().withMessage('Phone number is required'),
];