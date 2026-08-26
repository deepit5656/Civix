const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedback, updateFeedbackStatus } = require('../controllers/feedbackController');
const { verifyToken, isAdmin } = require('../middlewares/validate');

router.post('/', submitFeedback);
router.get('/', verifyToken, isAdmin, getAllFeedback);
router.patch('/:id/status', verifyToken, isAdmin, updateFeedbackStatus);

module.exports = router;
