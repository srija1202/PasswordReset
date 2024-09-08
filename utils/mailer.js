const nodemailer = require('nodemailer');
require('dotenv').config();

exports.sendResetEmail = async (recipientEmail, token) => {
  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Gmail's SMTP server
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS  // Your Gmail password or an app password
    }
  });

  // Define the email options
  const resetLink = `https://jade-sprite-2b38c2.netlify.app/reset-password/${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address (your Gmail)
    to: recipientEmail, // Recipient address
    subject: 'Password Reset',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`
  };

  // Send mail
  try {
    await transporter.sendMail(mailOptions);
    console.log('Reset email sent successfully');
  } catch (error) {
    console.error('Error sending reset email:', error);
  }
};
