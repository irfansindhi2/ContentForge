const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Route to get list details
router.get('/api/lists/:listName', isAuthenticated, listController.getListDetails);

module.exports = router;
