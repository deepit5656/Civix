const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  name: { type: String, default: null, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  location: { type: String, default: null },
  profilePictureUrl: { type: String, default: null },
  bio: { type: String, default: null, maxlength: 500 },
  phone: { type: String, default: null },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  lastLogin: { type: Date, default: null },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if profile is complete
userSchema.methods.isProfileComplete = function () {
  return !!(this.name && this.email && this.location);
};

// Remove sensitive fields from JSON output
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    username: this.username,
    name: this.name,
    email: this.email,
    role: this.role,
    location: this.location,
    profilePictureUrl: this.profilePictureUrl,
    bio: this.bio,
    phone: this.phone,
    isVerified: this.isVerified,
    isProfileComplete: this.isProfileComplete(),
    createdAt: this.createdAt,
    lastLogin: this.lastLogin,
  };
};

module.exports = mongoose.model('User', userSchema);
