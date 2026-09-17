const User = require('../models/userModel');
const xss = require('xss');
const { asyncHandler } = require('../utils/asyncHandler');
const { uploadOnCloudinary } = require('../utils/cloudinary');

// ─── GET ALL USERS (admin) ────────────────────────────────────────────────────
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, role } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { username: { $regex: search, $options: 'i' } },
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [users, total] = await Promise.all([
    User.find(filter, '-password').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    User.countDocuments(filter),
  ]);

  res.json({ users, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
});

// ─── GET USER BY ID ───────────────────────────────────────────────────────────
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id, '-password');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user.toSafeObject());
});

// ─── GET USER BY CLERK OR UNIQUE ID ─────────────────────────────────────────────
const getUserByClerkId = asyncHandler(async (req, res) => {
  const { clerkUserId } = req.params;
  let user = null;
  if (clerkUserId.includes('@')) {
    user = await User.findOne({ email: clerkUserId.toLowerCase() });
  } else if (clerkUserId.match(/^[0-9a-fA-F]{24}$/)) {
    user = await User.findById(clerkUserId);
  }
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user.toSafeObject());
});

// ─── UPDATE USER PROFILE ──────────────────────────────────────────────────────
const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.params.id || req.user?.id;
  const { name, email, location, bio, phone, profilePictureUrl } = req.body;

  if (!name || !email || !location) {
    return res.status(400).json({ error: 'Name, email, and location are required' });
  }

  const sanitized = {
    name: xss(name),
    email: xss(email).toLowerCase(),
    location: xss(location),
    ...(bio !== undefined && { bio: xss(bio) }),
    ...(phone !== undefined && { phone: xss(phone) }),
    ...(profilePictureUrl && { profilePictureUrl: xss(profilePictureUrl) }),
  };

  // Check email uniqueness (exclude self)
  const conflict = await User.findOne({ email: sanitized.email, _id: { $ne: userId } });
  if (conflict) return res.status(409).json({ error: 'Email already in use by another account' });

  const user = await User.findByIdAndUpdate(userId, sanitized, { new: true, runValidators: true });
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({ message: 'Profile updated successfully', user: user.toSafeObject() });
});

// ─── UPDATE BY CLERK ID ───────────────────────────────────────────────────────
const updateByClerkId = asyncHandler(async (req, res) => {
  const { clerkUserId } = req.params;
  const { name, email, location, bio, phone, profilePictureUrl } = req.body;

  if (!name || !email || !location) {
    return res.status(400).json({ error: 'Name, email, and location are required' });
  }

  const sanitized = {
    name: xss(name),
    email: xss(email).toLowerCase(),
    location: xss(location),
    ...(bio && { bio: xss(bio) }),
    ...(phone && { phone: xss(phone) }),
    ...(profilePictureUrl && { profilePictureUrl: xss(profilePictureUrl) }),
  };

  const conflict = await User.findOne({ email: sanitized.email, clerkUserId: { $ne: clerkUserId } });
  if (conflict) return res.status(409).json({ error: 'Email already taken' });

  const user = await User.findOneAndUpdate({ clerkUserId }, sanitized, { new: true });
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({ message: 'Profile updated', user: user.toSafeObject() });
});

// ─── CREATE OR UPDATE USER ────────────────────────────────
const createOrUpdateUserProfile = asyncHandler(async (req, res) => {
  const { userId, clerkUserId, email, name, location, profilePictureUrl } = req.body;

  const searchEmail = email ? email.toLowerCase().trim() : null;

  let user = null;
  if (userId) {
    user = await User.findById(userId);
  }
  if (!user && searchEmail) {
    user = await User.findOne({ email: searchEmail });
  }

  if (user) {
    if (searchEmail) user.email = searchEmail;
    if (name) user.name = name;
    if (location) user.location = location;
    if (profilePictureUrl) user.profilePictureUrl = profilePictureUrl;
    await user.save();
  } else if (searchEmail) {
    const username = searchEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '') + '_' + Date.now().toString().slice(-4);
    const adminEmail = process.env.ADMIN_EMAIL || 'admin123@gmail.com';
    user = await User.create({
      email: searchEmail,
      username,
      name: name || null,
      location: location || null,
      profilePictureUrl: profilePictureUrl || null,
      password: Math.random().toString(36).slice(-10),
      role: searchEmail === adminEmail.toLowerCase() ? 'admin' : 'user',
    });
  } else {
    return res.status(400).json({ error: 'Valid user ID or email is required' });
  }

  res.json({ user: user.toSafeObject(), isProfileComplete: user.isProfileComplete() });
});

// ─── UPLOAD PROFILE PICTURE ───────────────────────────────────────────────────
const uploadProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const cloudRes = await uploadOnCloudinary(req.file.path, 'civix/profiles');
  if (!cloudRes) return res.status(500).json({ error: 'Failed to upload image' });

  const userId = req.params.id || req.params.clerkUserId;
  let user;

  if (req.params.clerkUserId) {
    user = await User.findOneAndUpdate(
      { clerkUserId: req.params.clerkUserId },
      { profilePictureUrl: cloudRes.secure_url },
      { new: true }
    );
  } else {
    user = await User.findByIdAndUpdate(
      req.params.id || req.user.id,
      { profilePictureUrl: cloudRes.secure_url },
      { new: true }
    );
  }

  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({ profilePictureUrl: cloudRes.secure_url, message: 'Profile picture updated' });
});

// ─── DELETE USER (admin) ──────────────────────────────────────────────────────
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ message: 'User deleted successfully' });
});

// ─── UPDATE USER ROLE (admin) ─────────────────────────────────────────────────
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Role must be user or admin' });
  }

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({ message: 'Role updated', user: user.toSafeObject() });
});

module.exports = {
  getAllUsers,
  getUserById,
  getUserByClerkId,
  updateUserProfile,
  updateByClerkId,
  createOrUpdateUserProfile,
  uploadProfilePicture,
  deleteUser,
  updateUserRole,
};
