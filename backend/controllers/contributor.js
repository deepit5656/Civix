const fs = require('fs');
const path = require('path');
const { asyncHandler } = require('../utils/asyncHandler');

const getContributors = asyncHandler(async (req, res) => {
  const cachePath = path.join(__dirname, '../cache/contributors.json');
  
  try {
    if (fs.existsSync(cachePath)) {
      const data = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
      return res.json(data);
    }
  } catch (e) {
    console.error('Cache read error:', e);
  }

  res.json({ contributors: [], message: 'Contributors data unavailable' });
});

module.exports = { getContributors };
