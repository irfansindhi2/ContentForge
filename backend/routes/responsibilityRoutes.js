const express = require('express');
const router = express.Router();
const responsibilityController = require('../controllers/responsibilityController');
const { isAuthenticated } = require('../middleware/authMiddleware');  // Import the middleware

// Route to display active responsibilities, protected by authentication
router.get('/api/responsibilities', isAuthenticated, responsibilityController.getResponsibilities);

module.exports = router;
