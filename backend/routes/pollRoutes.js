const express = require('express');
const router = express.Router();
const { createPoll, getAllPolls, getPollById, voteOnPoll, closePoll, deletePoll } = require('../controllers/pollController');
const { verifyToken, isAdmin } = require('../middlewares/validate');

router.get('/', getAllPolls);
router.get('/:id', getPollById);
router.post('/', verifyToken, createPoll);
router.post('/:id/vote', verifyToken, voteOnPoll);
router.patch('/:id/close', verifyToken, isAdmin, closePoll);
router.delete('/:id', verifyToken, isAdmin, deletePoll);

module.exports = router;
