const Feedback = require('../models/feedback');
const sendEmail = require('../utils/sendEmail');
const { asyncHandler } = require('../utils/asyncHandler');

const submitFeedback = asyncHandler(async (req, res) => {
  const { name, email, subject, message, rating } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Name, email, subject, and message are required' });
  }

  const feedback = await Feedback.create({ name, email, subject, message, rating });

  // Notify admin
  sendEmail(
    process.env.EMAIL_ADMIN,
    `Civix - New Feedback: ${subject}`,
    `<h2>New Feedback Received</h2>
     <p><strong>From:</strong> ${name} (${email})</p>
     <p><strong>Subject:</strong> ${subject}</p>
     <p><strong>Rating:</strong> ${rating || 'Not given'}/5</p>
     <p><strong>Message:</strong></p>
     <p>${message}</p>`
  );

  // Send confirmation to user
  sendEmail(
    email,
    'Civix - Feedback Received',
    `<h2>Thank you, ${name}!</h2>
     <p>We have received your feedback and will get back to you soon.</p>`
  );

  res.status(201).json({ message: 'Feedback submitted successfully', id: feedback._id });
});

const getAllFeedback = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [feedbacks, total] = await Promise.all([
    Feedback.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    Feedback.countDocuments(filter),
  ]);

  res.json({ feedbacks, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
});

const updateFeedbackStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const feedback = await Feedback.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!feedback) return res.status(404).json({ error: 'Feedback not found' });
  res.json({ message: 'Status updated', feedback });
});

module.exports = { submitFeedback, getAllFeedback, updateFeedbackStatus };
