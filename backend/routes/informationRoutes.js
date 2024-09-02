const express = require('express');
const router = express.Router();
const informationController = require('../controllers/informationController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const normalizeData = require('../middleware/normalizeData');

// Routes for CRUD operations on information

// Route to get a list of information based on listName
router.post('/api/information/list/:listName', isAuthenticated, informationController.getInformationListByWebsite);

// Route to get specific information by primary key and website ID
router.get('/api/information/:listName/:id', isAuthenticated, informationController.getInformationByPrimaryKeyAndWebsite);

// Route to create a new information entry
router.post('/api/information/:listName', isAuthenticated, normalizeData, informationController.createInformation);

// Route to update an existing information entry
router.put('/api/information/:listName/:id', isAuthenticated, normalizeData, informationController.updateInformation);

// Route to delete an information entry
router.delete('/api/information/:listName/:id', isAuthenticated, informationController.deleteInformation);

module.exports = router;
