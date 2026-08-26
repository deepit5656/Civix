const express = require('express');
const router = express.Router();
const {
  getAllUsers, getUserById, getUserByClerkId,
  updateUserProfile, updateByClerkId,
  createOrUpdateUserProfile, uploadProfilePicture,
  deleteUser, updateUserRole,
} = require('../controllers/profileControllers');
const { verifyToken, isAdmin } = require('../middlewares/validate');
const { upload } = require('../middlewares/multer.middleware');

// Clerk integration
router.post('/create-or-update', createOrUpdateUserProfile);
router.get('/clerk/:clerkUserId', getUserByClerkId);
router.put('/clerk/:clerkUserId', updateByClerkId);
router.post('/clerk/:clerkUserId/profile-picture', upload.single('image'), uploadProfilePicture);

// Standard user routes
router.get('/me', verifyToken, (req, res, next) => {
  req.params.id = req.user.id;
  next();
}, getUserById);
router.put('/me', verifyToken, (req, res, next) => {
  req.params.id = req.user.id;
  next();
}, updateUserProfile);
router.post('/me/profile-picture', verifyToken, upload.single('image'), uploadProfilePicture);

// Admin routes
router.get('/', verifyToken, isAdmin, getAllUsers);
router.get('/:id', verifyToken, getUserById);
router.put('/:id', verifyToken, updateUserProfile);
router.delete('/:id', verifyToken, isAdmin, deleteUser);
router.patch('/:id/role', verifyToken, isAdmin, updateUserRole);

module.exports = router;
