const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, commentController.createComment);       // add comment
router.get('/post/:post_id', commentController.getCommentsByPost);      // get comments
router.post('/react', authMiddleware, commentController.reactToComment); // react

module.exports = router;
