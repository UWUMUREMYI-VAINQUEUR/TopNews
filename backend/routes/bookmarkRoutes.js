const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmarkController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', authMiddleware, bookmarkController.addBookmark);
router.post('/remove', authMiddleware, bookmarkController.removeBookmark);
router.get('/', authMiddleware, bookmarkController.getBookmarks);

module.exports = router;
