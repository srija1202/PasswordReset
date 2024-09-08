const User = require('../models/userModel');
const Blacklist = require('../models/blacklistModel');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { sendResetEmail } = require('../utils/mailer');
const { generateToken } = require('../utils/generateToken');

// Register a new user
exports.register = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = new User({ email, password: hashedPassword });
  await user.save();
  res.status(201).send('User registered successfully');
};

// Login a user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('Invalid credentials');
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send('Invalid credentials');
  
  const token = generateToken(user._id);
  res.json({ token });
};

// Initiate forgot password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send('User not found');
  
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
  await user.save();
  
  await sendResetEmail(user.email, resetToken);
  res.send('Password reset link sent to your email');
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  // Check if the new password and confirm password match
  if (newPassword !== confirmPassword) {
    return res.status(400).send('Passwords do not match');
  }

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() } // Ensure token hasn't expired
  });

  if (!user) {
    return res.status(400).send('Invalid or expired token');
  }

  // Hash the new password and save it
  user.password = await bcrypt.hash(newPassword, 12);
  user.resetToken = undefined; // Clear the reset token and expiry fields
  user.resetTokenExpiry = undefined;
  await user.save();

  res.send('Password has been reset successfully');
};

// Logout a user (blacklist JWT)
exports.logout = async (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) return res.status(400).send('No token provided');

  try {
    const decoded = jwt.decode(token);

    const blacklistedToken = new Blacklist({
      token,
      expiresAt: new Date(decoded.exp * 1000) // Convert expiration to milliseconds
    });

    await blacklistedToken.save();
    res.status(200).send('User logged out and token blacklisted successfully');
  } catch (error) {
    res.status(500).send('Error logging out');
  }
};
