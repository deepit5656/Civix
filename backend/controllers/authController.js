const z = require('zod');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const OTP = require('../models/otpModel');
const { asyncHandler } = require('../utils/asyncHandler');
const { generateToken } = require('../utils/token');
const sendEmail = require('../utils/sendEmail');
require('dotenv').config();

const connectDB = require('../config/mongo');

// Check if MongoDB is connected (attempts connection automatically)
const checkDbConnection = async (res) => {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      error: 'MongoDB is not connected. Please ensure MongoDB Atlas IP is whitelisted (0.0.0.0/0) or local MongoDB is running.',
    });
    return false;
  }
  return true;
};

// Helper to determine if an email belongs to an Admin
const determineUserRole = (email) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin123@gmail.com';
  const domainName = process.env.DOMAIN_NAME;
  
  if (email.toLowerCase() === adminEmail.toLowerCase()) {
    return 'admin';
  }
  if (domainName && domainName.trim() !== '' && domainName !== '@gmail.com' && email.toLowerCase().endsWith(domainName.toLowerCase())) {
    return 'admin';
  }
  return 'user';
};

const inMemoryOtpCache = new Map();
const verifiedEmailsCache = new Map();

// ─── SEND OTP ─────────────────────────────────────────────────────────────────
exports.sendOTP = asyncHandler(async (req, res) => {
  await checkDbConnection(res);

  const { email, type = 'signup' } = req.body;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: 'Valid email address is required' });
  }

  const cleanEmail = email.toLowerCase().trim();

  // Generate 6-digit random code
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  if (mongoose.connection.readyState === 1) {
    try {
      await OTP.deleteMany({ email: cleanEmail, type });
      await OTP.create({
        email: cleanEmail,
        otp: generatedOtp,
        type,
        expiresAt,
      });
    } catch (dbErr) {
      console.warn('⚠️ MongoDB write failed, using in-memory OTP cache fallback:', dbErr.message);
      inMemoryOtpCache.set(`${cleanEmail}_${type}`, { otp: generatedOtp, expiresAt });
    }
  } else {
    inMemoryOtpCache.set(`${cleanEmail}_${type}`, { otp: generatedOtp, expiresAt });
  }

  console.log(`🔐 [Civix Auth] OTP generated for ${cleanEmail} (${type}): ${generatedOtp}`);

  // Compose Email
  const subject = type === 'signup' 
    ? 'Verify your Civix Account OTP 🔐' 
    : 'Civix Login Verification OTP 🔐';
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #16a34a; text-align: center;">Civix Verification Code</h2>
      <p>Hello,</p>
      <p>Your 6-digit verification code is:</p>
      <div style="background-color: #f0fdf4; border: 1px dashed #22c55e; padding: 15px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #15803d; margin: 20px 0;">
        ${generatedOtp}
      </div>
      <p style="color: #64748b; font-size: 13px;">This code will expire in 10 minutes. If you did not request this code, please ignore this email.</p>
    </div>
  `;

  // Send Email asynchronously
  sendEmail(cleanEmail, subject, htmlContent);

  res.json({
    message: 'Verification code sent to your email',
  });
});

// ─── VERIFY OTP ───────────────────────────────────────────────────────────────
exports.verifyOTP = asyncHandler(async (req, res) => {
  await checkDbConnection(res);

  const { email, otp, type = 'signup' } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const cleanOtp = String(otp).trim();
  let otpRecord = null;

  if (mongoose.connection.readyState === 1) {
    try {
      otpRecord = await OTP.findOne({ email: cleanEmail, otp: cleanOtp, type });
    } catch (err) {
      const cached = inMemoryOtpCache.get(`${cleanEmail}_${type}`);
      if (cached && String(cached.otp).trim() === cleanOtp) {
        otpRecord = cached;
      }
    }
  }
  
  if (!otpRecord) {
    const cached = inMemoryOtpCache.get(`${cleanEmail}_${type}`);
    if (cached && String(cached.otp).trim() === cleanOtp) {
      otpRecord = cached;
    }
  }

  if (!otpRecord) {
    return res.status(400).json({ error: 'Invalid or expired verification code' });
  }

  if (new Date() > otpRecord.expiresAt) {
    inMemoryOtpCache.delete(`${cleanEmail}_${type}`);
    if (mongoose.connection.readyState === 1 && otpRecord._id) {
      await OTP.deleteOne({ _id: otpRecord._id }).catch(() => {});
    }
    return res.status(400).json({ error: 'Verification code has expired' });
  }

  // Record verified status for 15 minutes so signup/login flow can proceed
  verifiedEmailsCache.set(`${cleanEmail}_${type}`, Date.now());

  // Delete OTP after successful validation
  inMemoryOtpCache.delete(`${cleanEmail}_${type}`);
  if (mongoose.connection.readyState === 1 && otpRecord._id) {
    await OTP.deleteOne({ _id: otpRecord._id }).catch(() => {});
  }

  res.json({ message: 'OTP verified successfully', verified: true });
});

// ─── SIGNUP ───────────────────────────────────────────────────────────────────
exports.signup = asyncHandler(async (req, res) => {
  if (!await checkDbConnection(res)) return;

  const { username, email, password, name, otp } = req.body;

  const schema = z.object({
    username: z.string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username cannot exceed 30 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  });

  const result = schema.safeParse({ username, email, password });
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors[0].message });
  }

  const cleanEmail = email.toLowerCase().trim();

  // Validate OTP if provided
  if (otp) {
    const cleanOtp = String(otp).trim();
    let otpRecord = null;
    if (mongoose.connection.readyState === 1) {
      try {
        otpRecord = await OTP.findOne({ email: cleanEmail, otp: cleanOtp, type: 'signup' });
      } catch (err) {
        console.warn('⚠️ OTP find error:', err.message);
      }
    }
    if (!otpRecord) {
      const cached = inMemoryOtpCache.get(`${cleanEmail}_signup`);
      if (cached && String(cached.otp).trim() === cleanOtp && new Date() <= cached.expiresAt) {
        otpRecord = cached;
      }
    }

    const verifiedTimestamp = verifiedEmailsCache.get(`${cleanEmail}_signup`);
    const isRecentlyVerified = verifiedTimestamp && (Date.now() - verifiedTimestamp < 15 * 60 * 1000);

    if (!otpRecord && !isRecentlyVerified) {
      return res.status(400).json({ error: 'Invalid or expired OTP code' });
    }

    if (otpRecord && otpRecord._id && mongoose.connection.readyState === 1) {
      await OTP.deleteOne({ _id: otpRecord._id }).catch(() => {});
    }
    inMemoryOtpCache.delete(`${cleanEmail}_signup`);
    verifiedEmailsCache.delete(`${cleanEmail}_signup`);
  }

  // Check duplicates
  const existing = await User.findOne({ $or: [{ email: cleanEmail }, { username }] });
  if (existing) {
    if (existing.email === cleanEmail) {
      return res.status(409).json({ error: 'Email is already registered. Please log in.' });
    }
    return res.status(409).json({ error: 'Username is already taken' });
  }

  const role = determineUserRole(cleanEmail);

  const user = await User.create({
    username,
    email: cleanEmail,
    password,
    name: name || null,
    role,
    isVerified: true,
  });

  // Welcome email
  sendEmail(
    cleanEmail,
    'Welcome to Civix! 🎉',
    `<h2>Welcome to Civix, ${username}!</h2><p>Your account has been created successfully as a <strong>${role}</strong>.</p>`
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
  if (!await checkDbConnection(res)) return;

  const { email, password, otp } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const cleanEmail = email.toLowerCase().trim();
  let user = await User.findOne({ email: cleanEmail });

  // Handle OTP Quick Login
  if (otp) {
    const cleanOtp = String(otp).trim();
    let otpRecord = null;
    if (mongoose.connection.readyState === 1) {
      try {
        otpRecord = await OTP.findOne({ email: cleanEmail, otp: cleanOtp, type: 'login' });
      } catch (err) {
        console.warn('⚠️ OTP find error in login:', err.message);
      }
    }
    if (!otpRecord) {
      const cached = inMemoryOtpCache.get(`${cleanEmail}_login`);
      if (cached && String(cached.otp).trim() === cleanOtp && new Date() <= cached.expiresAt) {
        otpRecord = cached;
      }
    }

    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid or expired OTP code' });
    }

    if (otpRecord && otpRecord._id && mongoose.connection.readyState === 1) {
      await OTP.deleteOne({ _id: otpRecord._id }).catch(() => {});
    }
    inMemoryOtpCache.delete(`${cleanEmail}_login`);

    // Auto-create user if logging in via OTP for the first time
    if (!user) {
      const autoUsername = cleanEmail.split('@')[0] + '_' + Math.floor(Math.random() * 1000);
      const role = determineUserRole(cleanEmail);
      user = await User.create({
        username: autoUsername,
        email: cleanEmail,
        password: Math.random().toString(36).slice(-10),
        role,
        isVerified: true,
      });
    }
  } else {
    // Password Login
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user.password === 'clerk-auth') {
      return res.status(400).json({ error: 'This account was originally registered with Clerk. Please use OTP Quick Login to sign in.' });
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
  }

  // Ensure Admin role check is kept strictly up to date
  const expectedRole = determineUserRole(cleanEmail);
  if (user.role !== expectedRole) {
    user.role = expectedRole;
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken({ id: user._id, email: user.email, role: user.role, username: user.username });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
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

// ─── GET ME ───────────────────────────────────────────────────────────────────
exports.getMe = asyncHandler(async (req, res) => {
  if (!await checkDbConnection(res)) return;

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Sync role strictly with current rules
  const expectedRole = determineUserRole(user.email);
  if (user.role !== expectedRole) {
    user.role = expectedRole;
    await user.save();
  }

  res.json({ user: user.toSafeObject() });
});

// ─── CHANGE PASSWORD ──────────────────────────────────────────────────────────
exports.changePassword = asyncHandler(async (req, res) => {
  if (!await checkDbConnection(res)) return;

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

// ─── RESET PASSWORD ──────────────────────────────────────────────────────────
exports.resetPassword = asyncHandler(async (req, res) => {
  if (!await checkDbConnection(res)) return;

  const { email, otp, newPassword } = req.body;
  const cleanEmail = String(email || '').toLowerCase().trim();

  if (!/\S+@\S+\.\S+/.test(cleanEmail) || !otp || !newPassword) {
    return res.status(400).json({ error: 'Email, OTP, and new password are required' });
  }
  if (String(newPassword).length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }

  let otpRecord = null;
  if (mongoose.connection.readyState === 1) {
    otpRecord = await OTP.findOne({ email: cleanEmail, otp: String(otp).trim(), type: 'reset-password' });
  }
  if (!otpRecord) {
    const cached = inMemoryOtpCache.get(`${cleanEmail}_reset-password`);
    if (cached && String(cached.otp) === String(otp).trim() && new Date() <= cached.expiresAt) {
      otpRecord = cached;
    }
  }
  if (!otpRecord || new Date() > otpRecord.expiresAt) {
    return res.status(400).json({ error: 'Invalid or expired reset code' });
  }

  const user = await User.findOne({ email: cleanEmail });
  if (!user) return res.status(404).json({ error: 'No account exists for this email' });

  user.password = newPassword;
  await user.save();
  inMemoryOtpCache.delete(`${cleanEmail}_reset-password`);
  if (otpRecord._id && mongoose.connection.readyState === 1) {
    await OTP.deleteOne({ _id: otpRecord._id }).catch(() => {});
  }

  res.json({ message: 'Password reset successfully' });
});
