const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeIssue, chat, verifyResolution } = require('../controllers/aiController');

// Multer memory storage for direct buffer forwarding to Gemini / Vision
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

/**
 * POST /api/ai/analyze-issue
 * Analyzes photo + description to predict category, severity, title, and action
 */
router.post('/analyze-issue', upload.single('file'), analyzeIssue);

/**
 * POST /api/ai/chat
 * Conversational Civic Copilot
 */
router.post('/chat', chat);

/**
 * POST /api/ai/verify-resolution
 * AI Before-and-After photo audit
 */
router.post('/verify-resolution', upload.array('files', 2), verifyResolution);

module.exports = router;
