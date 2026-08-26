const z = require('zod');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { asyncHandler } = require('../utils/asyncHandler');
const { generateToken } = require('../utils/token');
const sendEmail = require('../utils/sendEmail');
require('dotenv').config();

// ─── SIGNUP ───────────────────────────────────────────────────────────────────
exports.signup = asyncHandler(async (req, res) => {
  const { username, email, password, name } = req.body;

  const schema = z.object({
    username: z.string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username cannot exceed 30 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed'),
    email: z.string().email('Enter a valid email'),
    password: z.string()
      .min(6, 'Password must be at least 6 characters')
      .regex(/[a-z]/, 'At least one lowercase letter required')
      .regex(/[0-9]/, 'At least one number required')
      .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'At least one special character required'),
  });

  const result = schema.safeParse({ username, email, password });
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors[0].message });
  }

  // Check duplicates
  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    if (existing.email === email.toLowerCase()) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    return res.status(409).json({ error: 'Username already taken' });
  }

  const role = (process.env.DOMAIN_NAME && email.endsWith(process.env.DOMAIN_NAME))
    ? 'admin'
    : 'user';

  const user = await User.create({ username, email, password, name: name || null, role });

  // Send welcome email (non-blocking)
  sendEmail(
    email,
    'Welcome to Civix! 🎉',
    `<h2>Welcome, ${username}!</h2><p>Your account has been created successfully.</p><p>Start reporting civic issues and making your community better.</p>`
  );

  const token = generateToken({ id: user._id, email: user.email, role: user.role, username: user.username });

  res.status(201).json({
    message: 'Account created successfully',
    token,
    user: user.toSafeObject(),
  });
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (user.password === 'clerk-auth') {
    return res.status(400).json({ error: 'This account uses Clerk authentication. Please sign in with Clerk.' });
  }

  const isValid = await user.comparePassword(password);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  const token = generateToken({ id: user._id, email: user.email, role: user.role, username: user.username });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  res.json({
    message: 'Login successful',
    token,
    user: user.toSafeObject(),
  });
});

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// ─── GET ME (current user) ────────────────────────────────────────────────────
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: user.toSafeObject() });
});

// ─── CHANGE PASSWORD ──────────────────────────────────────────────────────────
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const isValid = await user.comparePassword(currentPassword);
  if (!isValid) return res.status(401).json({ error: 'Current password is incorrect' });

  user.password = newPassword;
  await user.save();

  res.json({ message: 'Password changed successfully' });
});
