const express = require('express');
const { listRequests, createRequest, updateRequest } = require('../controllers/communityRequestController');
const { verifyToken } = require('../middlewares/validate');

const router = express.Router();
router.get('/', listRequests);
router.post('/', verifyToken, createRequest);
router.patch('/:id', verifyToken, updateRequest);

module.exports = router;
