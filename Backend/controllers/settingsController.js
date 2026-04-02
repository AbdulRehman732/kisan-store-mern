const Settings = require('../models/Settings');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Fetch system settings (Store name, logo, etc.)
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json({ settings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching settings' });
  }
};

// Update store details
exports.updateSettings = async (req, res) => {
  try {
    const { storeName, storeAddress, storePhone, footerText } = req.body;
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();

    settings.storeName = storeName || settings.storeName;
    settings.storeAddress = storeAddress || settings.storeAddress;
    settings.storePhone = storePhone || settings.storePhone;
    settings.footerText = footerText || settings.footerText;
    settings.lastUpdatedBy = req.user._id;

    await settings.save();
    res.json({ message: 'System branding updated successfully', settings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating settings' });
  }
};

// Upload and Optimize Store Logo
exports.uploadLogo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No logo file provided' });

    const fileName = `logo_${Date.now()}.webp`;
    const uploadPath = path.join(__dirname, '..', 'uploads', fileName);

    // Optimize logo: Convert to WebP, resize to fit a header (e.g., 200px height max)
    await sharp(req.file.buffer)
      .resize({ height: 200, withoutEnlargement: true })
      .webp({ quality: 90 })
      .toFile(uploadPath);

    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();

    // Delete old logo if it exists
    if (settings.logoUrl) {
      const oldPath = path.join(__dirname, '..', settings.logoUrl);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    settings.logoUrl = `/uploads/${fileName}`;
    settings.lastUpdatedBy = req.user._id;
    await settings.save();

    res.json({ message: 'Logo uploaded and optimized', logoUrl: settings.logoUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Logo processing failed' });
  }
};
