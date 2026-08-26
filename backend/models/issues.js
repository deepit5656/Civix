const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: 5000,
  },
  phone: { type: String, default: null },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
  },
  fileUrl: { type: String, default: null },
  category: {
    type: String,
    enum: ['Infrastructure', 'Water', 'Electricity', 'Sanitation', 'Roads', 'Education', 'Health', 'Other'],
    default: 'Other',
  },
  location: { type: String, default: null },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
    default: 'Pending',
  },
  notifyByEmail: { type: Boolean, default: false },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  adminNote: { type: String, default: null },
}, { timestamps: true });

// Index for faster queries
issueSchema.index({ status: 1, createdAt: -1 });
issueSchema.index({ email: 1 });

module.exports = mongoose.model('Issue', issueSchema);
