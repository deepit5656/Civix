const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// Validate express-validator results
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array(), error: errors.array()[0].msg });
  }
  next();
};

// Verify JWT token
const verifyToken = (req, res, next) => {
  let token = null;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (req.body?.token) {
    token = req.body.token;
  }

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Optional auth - doesn't fail if no token
const optionalAuth = (req, res, next) => {
  let token = null;
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      // ignore invalid token
    }
  }
  next();
};

// Admin role guard
const isAdmin = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  return res.status(403).json({ error: 'Admin access required' });
};

module.exports = { validateRequest, verifyToken, optionalAuth, isAdmin };
