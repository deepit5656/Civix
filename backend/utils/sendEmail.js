const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADMIN,
    pass: process.env.ADMIN_PASS,
  },
});

async function sendEmail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: `"Civix" <${process.env.EMAIL_ADMIN}>`,
      to,
      subject,
      html,
    });
    console.log(`✉️ Email sent to ${to}`);
  } catch (err) {
    console.error('Email send error:', err.message);
    // Don't throw — email failures shouldn't break the flow
  }
}

module.exports = sendEmail;
