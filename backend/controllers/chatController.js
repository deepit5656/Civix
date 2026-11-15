const ChatMessage = require('../models/chatMessage');
const { asyncHandler } = require('../utils/asyncHandler');

const getMessages = asyncHandler(async (req, res) => {
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 50));
  const messages = await ChatMessage.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  res.json({ messages: messages.reverse() });
});

const createMessage = asyncHandler(async (req, res) => {
  const message = String(req.body.message || '').trim();
  if (!message) return res.status(400).json({ error: 'Message is required' });
  if (message.length > 2000) return res.status(400).json({ error: 'Message is too long' });

  const name = req.user.name || req.user.username || 'Civix User';
  const created = await ChatMessage.create({
    userId: req.user.id,
    user: name,
    avatar: name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
    message,
  });

  res.status(201).json({ message: created });
});

module.exports = { getMessages, createMessage };
