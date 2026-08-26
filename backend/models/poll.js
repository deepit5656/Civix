const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 },
  voters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const pollSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 300 },
  description: { type: String, default: null },
  options: [optionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  endsAt: { type: Date, default: null },
  totalVotes: { type: Number, default: 0 },
  category: { type: String, default: 'General' },
}, { timestamps: true });

module.exports = mongoose.model('Poll', pollSchema);
