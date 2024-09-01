const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');  // Import the controller

// Route to handle user login
router.post('/api/login', userController.login);

module.exports = router;
