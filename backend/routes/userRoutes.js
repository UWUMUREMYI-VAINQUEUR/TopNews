const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Get user profile by username
router.get('/:username', userController.getUserProfile);

// Update profile
router.put('/update', authMiddleware, userController.updateUserProfile);

// Follow a user
router.post('/:id/follow', authMiddleware, userController.followUser);

// Unfollow a user
router.post('/:id/unfollow', authMiddleware, userController.unfollowUser);

module.exports = router;
