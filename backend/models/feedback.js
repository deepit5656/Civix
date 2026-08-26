const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  subject: { type: String, required: true },
  message: { type: String, required: true, maxlength: 2000 },
  rating: { type: Number, min: 1, max: 5, default: null },
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
