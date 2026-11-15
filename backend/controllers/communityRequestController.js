const CommunityRequest = require('../models/communityRequest');
const { asyncHandler } = require('../utils/asyncHandler');

exports.listRequests = asyncHandler(async (req, res) => {
  const filter = { status: { $ne: 'cancelled' } };
  if (req.query.type && ['blood', 'help', 'volunteer'].includes(req.query.type)) {
    filter.type = req.query.type;
  }
  const requests = await CommunityRequest.find(filter).sort({ createdAt: -1 }).limit(100).lean();
  res.json({ requests });
});

exports.createRequest = asyncHandler(async (req, res) => {
  const { type, title, description, bloodGroup, urgency, location, contact } = req.body;
  if (!['blood', 'help', 'volunteer'].includes(type) || !title || !description || !location) {
    return res.status(400).json({ error: 'Type, title, description, and location are required' });
  }
  const request = await CommunityRequest.create({
    type, title, description, bloodGroup, urgency, location, contact,
    createdBy: req.user.id,
    createdByName: req.user.name || req.user.username || 'Civix member',
  });
  res.status(201).json({ request });
});

exports.updateRequest = asyncHandler(async (req, res) => {
  const request = await CommunityRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ error: 'Request not found' });
  if (String(request.createdBy) !== String(req.user.id)) {
    return res.status(403).json({ error: 'Only the request owner can update it' });
  }
  if (req.body.status && ['open', 'accepted', 'completed', 'cancelled'].includes(req.body.status)) {
    request.status = req.body.status;
  }
  await request.save();
  res.json({ request });
});
