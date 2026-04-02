const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    // Remove special characters from filename
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '-');
    cb(null, `product-${Date.now()}-${safeName}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|csv/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel';
  if (extname && mimetype) cb(null, true);
  else cb(new Error('Images (jpeg, jpg, png, webp) or CSV files only!'));
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5                    // max 5 files
  },
  fileFilter
});

module.exports = upload;