const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { signup, login, logout, getMe, changePassword, sendOTP, verifyOTP } = require('../controllers/authController');
const { validateRequest, verifyToken } = require('../middlewares/validate');

// POST /api/auth/send-otp
router.post('/send-otp',
  [
    body('email').trim().isEmail().normalizeEmail().withMessage('Valid email required'),
  ],
  validateRequest,
  sendOTP
);

// POST /api/auth/verify-otp
router.post('/verify-otp',
  [
    body('email').trim().isEmail().normalizeEmail().withMessage('Valid email required'),
    body('otp').trim().isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  ],
  validateRequest,
  verifyOTP
);

// POST /api/auth/signup
router.post('/signup',
  [
    body('username').trim().isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/).withMessage('Username: 3-30 alphanumeric chars'),
    body('email').trim().isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 characters'),
  ],
  validateRequest,
  signup
);

// POST /api/auth/login
router.post('/login',
  [
    body('email').trim().isEmail().normalizeEmail().withMessage('Valid email required'),
  ],
  validateRequest,
  login
);

// POST /api/auth/logout
router.post('/logout', logout);

// GET /api/auth/me
router.get('/me', verifyToken, getMe);

// PUT /api/auth/change-password
router.put('/change-password', verifyToken, changePassword);

module.exports = router;
