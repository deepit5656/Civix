const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['signup', 'login', 'reset-password'],
    default: 'signup',
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // Document auto-deletes when expiresAt date passes
  },
}, { timestamps: true });

module.exports = mongoose.model('OTP', otpSchema);
