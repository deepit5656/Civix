const express = require('express');
const router = express.Router();
const { getItems, createItem } = require('../controllers/lostFoundController');
const { verifyToken } = require('../middlewares/validate');

router.get('/', getItems);
router.post('/', verifyToken, createItem);

module.exports = router;
