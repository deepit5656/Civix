const LostFound = require('../models/lostFound');
const { asyncHandler } = require('../utils/asyncHandler');

const getItems = asyncHandler(async (req, res) => {
  const { type, search, location, page = 1, limit = 50 } = req.query;
  const filter = {};

  if (type && ['lost', 'found'].includes(type)) filter.type = type;
  if (location) filter.location = { $regex: location, $options: 'i' };
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
    ];
  }

  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
  const [items, total] = await Promise.all([
    LostFound.find(filter)
      .sort({ createdAt: -1 })
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit),
    LostFound.countDocuments(filter),
  ]);

  res.json({
    items,
    pagination: {
      total,
      page: parsedPage,
      pages: Math.ceil(total / parsedLimit),
      limit: parsedLimit,
    },
  });
});

const createItem = asyncHandler(async (req, res) => {
  const {
    type, name, description, location, date,
    contactName, contactPhone, contactEmail,
  } = req.body;

  if (!type || !name || !description || !location || !date ||
      !contactName || !contactPhone || !contactEmail) {
    return res.status(400).json({ error: 'All lost and found fields are required' });
  }
  if (!['lost', 'found'].includes(type)) {
    return res.status(400).json({ error: 'Type must be lost or found' });
  }

  const item = await LostFound.create({
    type,
    name,
    description,
    location,
    date,
    contactName,
    contactPhone,
    contactEmail,
    submittedBy: req.user.id,
  });

  res.status(201).json({ message: 'Item notice published successfully', item });
});

module.exports = { getItems, createItem };
