const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Helpers for token generation
const generateAccessToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m'
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'refresh_secret_fallback', {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d'
  });
};

const setCookies = (res, accessToken, refreshToken) => {
  const cookieOptions = {
    httpOnly: true,
    secure: false, // Ensure cookies are sent over HTTP in local dev
    sameSite: 'Lax'
  };

  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000 // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');

    const user = await User.create({
      first_name,
      last_name,
      email,
      password, // hashed by pre-save hook
      phone: Array.isArray(phone) ? phone : (phone ? [phone] : []),
      verificationToken
    });

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      user: {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(401).json({ 
        message: 'Account is temporarily locked. Try again later.' 
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      console.log(`[AUTH] Password mismatch for ${email}`);
      // Increment failed attempts
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 min lock
      }
      await user.save();
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log(`[AUTH] Successful login for ${email} (${user.role})`);

    // Success - reset attempts
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    setCookies(res, accessToken, refreshToken);

    res.json({
      token: accessToken,
      user: {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'Refresh token missing' });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refresh_secret_fallback');
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = generateAccessToken(user._id, user.role);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    setCookies(res, newAccessToken, newRefreshToken);

    res.json({ message: 'Tokens refreshed' });
  } catch (err) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      const user = await User.findOne({ refreshToken: token });
      if (user) {
        user.refreshToken = undefined;
        await user.save();
      }
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { first_name, last_name, phone, avatarUrl, address, city, cnic } = req.body;
    const user = await User.findById(req.user._id);

    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (phone) user.phone = Array.isArray(phone) ? phone : [phone];
    if (avatarUrl) user.avatarUrl = avatarUrl;
    if (address) user.address = address;
    if (city) user.city = city;
    if (cnic) user.cnic = cnic;

    await user.save();
    res.json({ user: {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      address: user.address,
      city: user.city,
      cnic: user.cnic
    }});
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: 'Current password incorrect' });

    user.password = newPassword; // Will be hashed by pre-save
    user.refreshToken = undefined; // Revoke sessions
    await user.save();

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ message: 'Password changed. Please login again.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { cart } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.cart = cart; // cart is [{product, quantity}]
    await user.save();

    res.json({ message: 'Cart synced' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const MailService = require('../services/MailService');

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No user with that email' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    const resetUrl = `http://localhost:3000/#/reset-password/${resetToken}`;
    
    // Dispatch real (mocked) email
    const mailResult = await MailService.sendResetEmail(user, resetUrl);
    
    if (mailResult && mailResult.success) {
       console.log(`[AUTH] Recovery Email Dispatch Log: ${mailResult.previewUrl}`);
       res.json({ message: 'Institutional recovery link dispatched.', previewUrl: mailResult.previewUrl });
    } else {
       res.status(500).json({ message: 'Email dispatch failed. Recovery simulation aborted.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ 
      resetPasswordToken, 
      resetPasswordExpires: { $gt: Date.now() } 
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.sendTemplateEmail = async (req, res) => {
  try {
    const { email, subject, text } = req.body;
    if (!email || !subject || !text) {
      return res.status(400).json({ message: 'Missing institutional dispatch payload (email, subject, or text)' });
    }

    const result = await MailService.sendGenericTemplate(email, subject, text);
    if (result && result.success) {
      res.json({ message: 'Institutional message dispatched.', previewUrl: result.previewUrl });
    } else {
      res.status(500).json({ message: 'Dispatch failed. SMTP handshake error.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const avatarUrl = `/uploads/${req.file.filename}`;
    const user = await User.findById(req.user._id);
    user.avatarUrl = avatarUrl;
    await user.save();
    res.json({ avatarUrl });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
