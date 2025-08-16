const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ error: 'Invalid post ID' });
  }
  next();
}, postController.getPostById);

// List all posts
router.get('/', postController.listPosts);

// Specific post subroutes must come BEFORE the plain `/:id`
router.get('/:id/likes-dislikes-count', postController.getLikesDislikesCount);
router.get('/:id/user-reaction', authMiddleware, postController.getUserReaction);
router.post('/:id/like', authMiddleware, postController.likeDislikePost);

// Get a post by ID
router.get('/:id', postController.getPostById);

// Create a new post
router.post('/', authMiddleware, postController.createPost);


module.exports = router;
