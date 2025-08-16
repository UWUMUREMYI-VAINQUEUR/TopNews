const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/follow', authMiddleware, followController.followUser);
router.post('/unfollow', authMiddleware, followController.unfollowUser);

module.exports = router;
