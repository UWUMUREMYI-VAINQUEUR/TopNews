const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const upload = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

// Upload Image
router.post(
  '/image',
  authMiddleware,
  upload.single('image'),   // ✅ works now
  uploadController.uploadImage
);

// Upload Video
router.post(
  '/video',
  authMiddleware,
  upload.single('video'),   // ✅ added support for video
  uploadController.uploadVideo
);

module.exports = router;
