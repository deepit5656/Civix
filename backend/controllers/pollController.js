const Poll = require('../models/poll');
const { asyncHandler } = require('../utils/asyncHandler');

// Create poll
const createPoll = asyncHandler(async (req, res) => {
  const { title, description, options, endsAt, category } = req.body;

  if (!title || !options || options.length < 2) {
    return res.status(400).json({ error: 'Title and at least 2 options are required' });
  }

  const poll = await Poll.create({
    title,
    description,
    options: options.map((text) => ({ text })),
    createdBy: req.user.id,
    endsAt: endsAt || null,
    category: category || 'General',
  });

  res.status(201).json({ message: 'Poll created', poll });
});

// Get all polls
const getAllPolls = asyncHandler(async (req, res) => {
  const { active, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (active === 'true') filter.isActive = true;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [polls, total] = await Promise.all([
    Poll.find(filter)
      .populate('createdBy', 'username name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Poll.countDocuments(filter),
  ]);

  res.json({ polls, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
});

// Get poll by ID
const getPollById = asyncHandler(async (req, res) => {
  const poll = await Poll.findById(req.params.id).populate('createdBy', 'username name');
  if (!poll) return res.status(404).json({ error: 'Poll not found' });
  res.json(poll);
});

// Vote on poll
const voteOnPoll = asyncHandler(async (req, res) => {
  const { optionIndex } = req.body;
  const poll = await Poll.findById(req.params.id);

  if (!poll) return res.status(404).json({ error: 'Poll not found' });
  if (!poll.isActive) return res.status(400).json({ error: 'Poll is closed' });
  if (poll.endsAt && new Date() > poll.endsAt) {
    poll.isActive = false;
    await poll.save();
    return res.status(400).json({ error: 'Poll has ended' });
  }

  // Check if user already voted
  const alreadyVoted = poll.options.some((opt) =>
    opt.voters.includes(req.user.id)
  );
  if (alreadyVoted) return res.status(400).json({ error: 'You have already voted on this poll' });

  if (optionIndex < 0 || optionIndex >= poll.options.length) {
    return res.status(400).json({ error: 'Invalid option index' });
  }

  poll.options[optionIndex].votes += 1;
  poll.options[optionIndex].voters.push(req.user.id);
  poll.totalVotes += 1;
  await poll.save();

  res.json({ message: 'Vote recorded', poll });
});

// Close poll (admin)
const closePoll = asyncHandler(async (req, res) => {
  const poll = await Poll.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!poll) return res.status(404).json({ error: 'Poll not found' });
  res.json({ message: 'Poll closed', poll });
});

// Delete poll (admin)
const deletePoll = asyncHandler(async (req, res) => {
  const poll = await Poll.findByIdAndDelete(req.params.id);
  if (!poll) return res.status(404).json({ error: 'Poll not found' });
  res.json({ message: 'Poll deleted' });
});

module.exports = { createPoll, getAllPolls, getPollById, voteOnPoll, closePoll, deletePoll };
