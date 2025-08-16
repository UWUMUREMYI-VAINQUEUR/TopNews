const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, likeController.likeDislikePost);

module.exports = router;
