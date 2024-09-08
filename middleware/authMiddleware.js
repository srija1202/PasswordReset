const jwt = require('jsonwebtoken');
const Blacklist = require('../models/blacklistModel');

// Middleware to authenticate and check if token is blacklisted
exports.authenticate = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    // Check if the token is blacklisted
    const blacklistedToken = await Blacklist.findOne({ token });
    if (blacklistedToken) return res.status(401).send('Token has been blacklisted');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user details to request
    next();
  } catch (err) {
    res.status(400).send('Invalid token');
  }
};
