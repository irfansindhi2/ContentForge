const express = require('express');
const router = express.Router();
const informationController = require('../controllers/informationController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const normalizeData = require('../middleware/normalizeData');

// Routes for CRUD operations on information

// Route to get a list of information based on formName
router.post('/api/information/list/:formName', isAuthenticated, informationController.getInformationListByWebsite);

// Route to get specific information by primary key and website ID
router.get('/api/information/:formName/:id', isAuthenticated, informationController.getInformationByPrimaryKeyAndWebsite);

// Route to create a new information entry
router.post('/api/information/:formName', isAuthenticated, normalizeData, informationController.createInformation);

// Route to update an existing information entry
router.put('/api/information/:formName/:id', isAuthenticated, normalizeData, informationController.updateInformation);

// Route to delete an information entry
router.delete('/api/information/:formName/:id', isAuthenticated, informationController.deleteInformation);

module.exports = router;
