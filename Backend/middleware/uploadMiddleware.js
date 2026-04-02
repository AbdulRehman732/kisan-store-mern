const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Store in memory to process with sharp before saving
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'text/csv', 
    'application/vnd.ms-excel',
    'image/jpeg',
    'image/png',
    'image/webp'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV and Images (JPG, PNG, WEBP) are allowed'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Post-upload processing for images
const resizeImage = async (req, res, next) => {
  if (!req.file || !req.file.mimetype.startsWith('image')) return next();

  // Create unique filename
  const filename = `${Date.now()}-${req.file.originalname.split('.')[0]}.webp`;
  const outputPath = path.join(uploadDir, filename);

  try {
    await sharp(req.file.buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .toFormat('webp')
      .webp({ quality: 80 })
      .toFile(outputPath);

    // Replace req.file properties to match the new file
    req.file.filename = filename;
    req.file.path = outputPath;
    req.file.mimetype = 'image/webp';
    
    next();
  } catch (err) {
    console.error('Image processing error:', err);
    next(err);
  }
};

module.exports = { upload, resizeImage };
