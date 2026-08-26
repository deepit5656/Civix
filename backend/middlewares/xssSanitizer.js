const xss = require('xss');

const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj;
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k,
      typeof v === 'string' ? xss(v) : typeof v === 'object' ? sanitizeObject(v) : v,
    ])
  );
};

const xssSanitizer = (req, res, next) => {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  next();
};

module.exports = { xssSanitizer };
