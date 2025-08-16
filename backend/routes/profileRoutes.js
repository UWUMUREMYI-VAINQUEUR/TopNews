const express = require('express');
const router = express.Router();
const multer = require('multer');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

// Multer setup (memory storage for Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/:username', authMiddleware, profileController.getUserProfile);

router.put(
  '/update',
  authMiddleware,
  upload.single('avatar'),
  profileController.updateUserProfile
);

module.exports = router;
