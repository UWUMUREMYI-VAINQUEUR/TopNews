const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', tagController.getTags);
router.post('/create', authMiddleware, tagController.createTag);
router.delete('/delete/:id', authMiddleware, tagController.deleteTag);

module.exports = router;
