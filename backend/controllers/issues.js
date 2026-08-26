const mongoose = require('mongoose');
const Issue = require('../models/issues');
const Notification = require('../models/notification');
const sendEmail = require('../utils/sendEmail');
const { asyncHandler } = require('../utils/asyncHandler');
const { uploadOnCloudinary } = require('../utils/cloudinary');

// ─── CREATE ISSUE ─────────────────────────────────────────────────────────────
const createIssue = asyncHandler(async (req, res) => {
  const { title, description, phone, email, notifyByEmail, category, location } = req.body;

  if (!title || !description || !email) {
    return res.status(400).json({ error: 'Title, description, and email are required' });
  }

  let fileUrl = null;
  if (req.file) {
    const cloudRes = await uploadOnCloudinary(req.file.path, 'civix/issues');
    if (!cloudRes) {
      return res.status(500).json({ error: 'Failed to upload file. Please try again.' });
    }
    fileUrl = cloudRes.secure_url;
  }

  const issue = await Issue.create({
    title,
    description,
    phone: phone || null,
    email,
    notifyByEmail: notifyByEmail === 'true' || notifyByEmail === true,
    fileUrl,
    category: category || 'Other',
    location: location || null,
    submittedBy: req.user?.id || null,
  });

  // Send confirmation email
  if (notifyByEmail === 'true' || notifyByEmail === true) {
    sendEmail(
      email,
      'Civix - Issue Submitted Successfully',
      `<h2>Issue Received</h2>
       <p>Your issue <strong>"${title}"</strong> has been submitted successfully.</p>
       <p>Issue ID: <code>${issue._id}</code></p>
       <p>Status: <strong>Pending</strong></p>
       <p>We will review and update you on the progress.</p>`
    );
  }

  res.status(201).json({ message: 'Issue submitted successfully', issue });
});

// ─── GET ALL ISSUES ───────────────────────────────────────────────────────────
const getAllIssues = asyncHandler(async (req, res) => {
  const { status, category, page = 1, limit = 20, search } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [issues, total] = await Promise.all([
    Issue.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    Issue.countDocuments(filter),
  ]);

  res.json({
    issues,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit),
    },
  });
});

// ─── GET ISSUE BY ID ──────────────────────────────────────────────────────────
const getIssueById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid issue ID format' });
  }

  const issue = await Issue.findById(id).populate('submittedBy', 'username name email');
  if (!issue) return res.status(404).json({ error: 'Issue not found' });

  res.json(issue);
});

// ─── UPDATE ISSUE STATUS (admin) ──────────────────────────────────────────────
const updateIssueStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { newStatus, adminNote } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid issue ID' });
  }

  const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
  if (!validStatuses.includes(newStatus)) {
    return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
  }

  const issue = await Issue.findById(id);
  if (!issue) return res.status(404).json({ error: 'Issue not found' });

  const oldStatus = issue.status;
  issue.status = newStatus;
  if (adminNote) issue.adminNote = adminNote;
  await issue.save();

  // Notify user by email
  if (issue.notifyByEmail && issue.email) {
    sendEmail(
      issue.email,
      `Civix - Issue Status Updated: ${newStatus}`,
      `<h2>Issue Update</h2>
       <p>Your issue <strong>"${issue.title}"</strong> status has changed.</p>
       <p>Previous status: <strong>${oldStatus}</strong></p>
       <p>New status: <strong>${newStatus}</strong></p>
       ${adminNote ? `<p>Admin note: ${adminNote}</p>` : ''}
       <p>Issue ID: <code>${issue._id}</code></p>`
    );
  }

  res.json({ message: 'Status updated successfully', issue });
});

// ─── UPDATE ISSUE ─────────────────────────────────────────────────────────────
const updateIssue = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid issue ID' });
  }

  const { title, description, phone, email, notifyByEmail, category, location } = req.body;

  let fileUrl;
  if (req.file) {
    const cloudRes = await uploadOnCloudinary(req.file.path, 'civix/issues');
    if (cloudRes) fileUrl = cloudRes.secure_url;
  }

  const updates = {
    ...(title && { title }),
    ...(description && { description }),
    ...(phone !== undefined && { phone }),
    ...(email && { email }),
    ...(notifyByEmail !== undefined && { notifyByEmail: notifyByEmail === 'true' || notifyByEmail === true }),
    ...(category && { category }),
    ...(location && { location }),
    ...(fileUrl && { fileUrl }),
  };

  const updated = await Issue.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!updated) return res.status(404).json({ error: 'Issue not found' });

  res.json({ message: 'Issue updated successfully', issue: updated });
});

// ─── DELETE ISSUE ─────────────────────────────────────────────────────────────
const deleteIssue = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid issue ID' });
  }

  const issue = await Issue.findByIdAndDelete(id);
  if (!issue) return res.status(404).json({ error: 'Issue not found' });

  res.json({ message: 'Issue deleted successfully', issue });
});

// ─── GET ISSUE STATS ──────────────────────────────────────────────────────────
const getIssueStats = asyncHandler(async (req, res) => {
  const stats = await Issue.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const categoryStats = await Issue.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  const result = { total: 0, byStatus: {}, byCategory: {} };
  stats.forEach(({ _id, count }) => {
    result.byStatus[_id] = count;
    result.total += count;
  });
  categoryStats.forEach(({ _id, count }) => {
    result.byCategory[_id] = count;
  });

  res.json(result);
});

// ─── GET MY ISSUES (authenticated user) ──────────────────────────────────────
const getMyIssues = asyncHandler(async (req, res) => {
  const issues = await Issue.find({
    $or: [
      { submittedBy: req.user.id },
      { email: req.user.email },
    ],
  }).sort({ createdAt: -1 });

  res.json(issues);
});

module.exports = {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssueStatus,
  updateIssue,
  deleteIssue,
  getIssueStats,
  getMyIssues,
};
