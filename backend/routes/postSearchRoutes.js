const express = require('express');
const router = express.Router();
const postSearchController = require('../controllers/postSearchController');
// server/routes/postSearchRoutes.js

router.get('/', postSearchController.searchPosts);



module.exports = router;
