const express = require('express');
const router = express.Router();
const { getMessages, createMessage } = require('../controllers/chatController');
const { verifyToken } = require('../middlewares/validate');

router.get('/', getMessages);
router.post('/', verifyToken, createMessage);

module.exports = router;
