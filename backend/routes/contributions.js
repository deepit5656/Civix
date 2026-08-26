const express = require('express');
const router = express.Router();
const { getContributors } = require('../controllers/contributor');

router.get('/', getContributors);

module.exports = router;
