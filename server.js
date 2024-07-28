const express = require('express');
const nodemailer = require('nodemailer');
const nodemailerExpressHandlebars = require('nodemailer-express-handlebars');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.use(
  'compile',
  nodemailerExpressHandlebars({
    viewEngine: {
      extName: '.hbs',
      partialsDir: path.resolve('./views'),
      layoutsDir: path.resolve('./views/'),
      defaultLayout: false, // Assuming you have a different template for profile updates
    },
    viewPath: path.resolve('./views/'),
  })
);

app.post('/send-email', async (req, res) => {
  const { name, email, password } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to IIITDMJ CSE Mobile App',
    template: 'welcomeEmail',
    context: {
      name: name,
      email: email,
      password: password,
    },
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error.message);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

app.post('/send-update-profile-email', async (req, res) => {
  const { name, email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Profile Update Notification',
    template: 'updateProfile', // Assuming you have a template named 'updateProfile'
    context: {
      name: name,
      email: email,
    },
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Profile update email sent successfully' });
  } catch (error) {
    console.error('Error sending profile update email:', error.message);
    res.status(500).json({ success: false, message: 'Failed to send profile update email' });
  }
});

app.post('/send-update-password-email', async (req, res) => {
  const { name, email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Update Notification',
    template: 'updatePassword', // Assuming you have a template named 'updateProfile'
    context: {
      name: name,
      email: email,
    },
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Profile update email sent successfully' });
  } catch (error) {
    console.error('Error sending profile update email:', error.message);
    res.status(500).json({ success: false, message: 'Failed to send profile update email' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
