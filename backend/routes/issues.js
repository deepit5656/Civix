const express = require('express');
const router = express.Router();
const {
  createIssue, getAllIssues, getIssueById,
  updateIssueStatus, updateIssue, deleteIssue,
  getIssueStats, getMyIssues,
} = require('../controllers/issues');
const { verifyToken, isAdmin, optionalAuth } = require('../middlewares/validate');
const { upload } = require('../middlewares/multer.middleware');

// Public
router.get('/', getAllIssues);
router.get('/stats', getIssueStats);
router.get('/:id', getIssueById);

// Authenticated
router.post('/', optionalAuth, upload.single('file'), createIssue);
router.get('/user/my', verifyToken, getMyIssues);
router.patch('/:id', verifyToken, upload.single('file'), updateIssue);

// Admin only
router.patch('/:id/status', verifyToken, isAdmin, updateIssueStatus);
router.delete('/:id', verifyToken, isAdmin, deleteIssue);

module.exports = router;
