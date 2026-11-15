const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['lost', 'found'],
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  location: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  date: {
    type: String,
    required: true,
  },
  contactName: { type: String, required: true, trim: true, maxlength: 120 },
  contactPhone: { type: String, required: true, trim: true, maxlength: 40 },
  contactEmail: { type: String, required: true, lowercase: true, trim: true },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

lostFoundSchema.index({ type: 1, createdAt: -1 });
lostFoundSchema.index({ location: 1 });

module.exports = mongoose.model('LostFound', lostFoundSchema);
