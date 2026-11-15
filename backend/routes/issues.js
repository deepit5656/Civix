const express = require('express');
const router = express.Router();
const {
  createIssue, getAllIssues, getIssueById,
  updateIssueStatus, updateIssue, deleteIssue,
  getIssueStats, getMyIssues, upvoteIssue, escalateIssue,
} = require('../controllers/issues');
const { verifyToken, isAdmin, optionalAuth } = require('../middlewares/validate');
const { upload } = require('../middlewares/multer.middleware');

// Public
router.get('/', getAllIssues);
router.get('/stats', getIssueStats);
router.get('/:id', getIssueById);
router.patch('/:id/upvote', optionalAuth, upvoteIssue);

// Authenticated
router.post('/', optionalAuth, upload.single('file'), createIssue);
router.get('/user/my', verifyToken, getMyIssues);
router.patch('/:id', verifyToken, upload.single('file'), updateIssue);
router.patch('/:id/escalate', verifyToken, escalateIssue);

// Admin only
router.patch('/:id/status', verifyToken, isAdmin, updateIssueStatus);
router.delete('/:id', verifyToken, isAdmin, deleteIssue);

module.exports = router;
