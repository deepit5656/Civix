const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  user: { type: String, required: true, trim: true, maxlength: 120 },
  avatar: { type: String, required: true, trim: true, maxlength: 4 },
  message: { type: String, required: true, trim: true, maxlength: 2000 },
}, { timestamps: true });

chatMessageSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
