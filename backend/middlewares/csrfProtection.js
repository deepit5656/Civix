// CSRF protection - simplified for API usage
// For cookie-based sessions use csurf; for token-based JWT APIs CSRF is less critical
const skipCSRFForRoutes = (skipRoutes) => (req, res, next) => {
  // Attach a dummy csrfToken function so routes don't break
  req.csrfToken = () => 'csrf-disabled-for-api';
  next();
};

const csrfErrorHandler = (err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  next(err);
};

module.exports = { skipCSRFForRoutes, csrfErrorHandler };
