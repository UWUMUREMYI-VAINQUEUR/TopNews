const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

// Public: get categories
router.get('/', categoryController.getCategories);

// Protected: create/delete (admin or journalist only, add role-check middleware if needed)
router.post('/create', authMiddleware, categoryController.createCategory);
router.delete('/delete/:id', authMiddleware, categoryController.deleteCategory);

module.exports = router;
