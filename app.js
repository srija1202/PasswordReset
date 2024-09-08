const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const authController = require('./controllers/authController');
const { authenticate } = require('./middleware/authMiddleware');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Auth routes
app.post('/register', authController.register);
app.post('/login', authController.login);
app.post('/forgot-password', authController.forgotPassword);
app.post('/reset-password', authController.resetPassword);
app.post('/logout', authenticate, authController.logout);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
