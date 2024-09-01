const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Route to get form details by form name with optional id as query parameter
router.get('/api/form/:formName', isAuthenticated, formController.getFormDetailsByName);

module.exports = router;
