const mongoose = require('mongoose');

const communityRequestSchema = new mongoose.Schema({
  type: { type: String, enum: ['blood', 'help', 'volunteer'], required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 1000 },
  bloodGroup: { type: String, trim: true },
  urgency: { type: String, enum: ['normal', 'urgent', 'critical'], default: 'normal' },
  location: { type: String, required: true, trim: true, maxlength: 160 },
  contact: { type: String, trim: true, maxlength: 120 },
  status: { type: String, enum: ['open', 'accepted', 'completed', 'cancelled'], default: 'open', index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdByName: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('CommunityRequest', communityRequestSchema);
