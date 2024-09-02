const informationService = require('../services/informationService');


/**
 * Controller to fetch a list of information records by website ID with sorting options.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Sends a JSON response with the retrieved information.
 */
exports.getInformationListByWebsite = async (req, res) => {
  const { listName } = req.params; // Extract listName from the URL parameters
  const limit = parseInt(req.body.limit, 10) || 12;  // Set the limit of records, defaulting to 12 if not provided
  const offset = parseInt(req.body.offset, 10) || 0; // Set the offset for pagination, defaulting to 0

  try {
    // Retrieve the website ID from the session
    const websiteId = req.session.user?.website_id;

    // Check if website ID is available in the session
    if (!websiteId) {
      return res.status(401).json({ error: 'Unauthorized: No website ID in session' });
    }

    // Extract sort options from the request body
    const sortOptions = req.body.sort || {};

    // Extract search conditions from the request body
    const searchConditions = req.body.searchConditions || {};

    // Fetch the list of information from the service layer with sorting options
    const { count, rows } = await informationService.getInformationListByWebsite(
      listName, 
      websiteId, 
      limit, 
      offset, 
      sortOptions,
      searchConditions
    );

    // Send a successful response with the total count and the data rows
    res.status(200).json({ total: count, data: rows });
  } catch (error) {
    // Log the error and send a 500 response if something goes wrong
    console.error('Error fetching information list:', error);
    res.status(500).json({ error: 'Failed to fetch information list' });
  }
};


/**
 * Controller to fetch specific information by primary key and website ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Sends a JSON response with the retrieved information.
 */
exports.getInformationByPrimaryKeyAndWebsite = async (req, res) => {
  const { id, listName } = req.params; // Extract the primary key ID and listName from the URL parameters
  const websiteId = req.session.user?.website_id; // Get the website ID from the session

  try {
    // Check if the website ID is present in the session
    if (!websiteId) {
      return res.status(400).json({ error: 'Website ID not found in session.' });
    }

    // Fetch the specific information by primary key and website ID
    const information = await informationService.getInformationByPrimaryKeyAndWebsite(listName, id, websiteId);

    // Send a successful response with the retrieved information
    res.status(200).json(information);
  } catch (error) {
    // Log the error and send a 500 response if something goes wrong
    console.error('Error fetching information:', error);
    res.status(500).json({ error: 'Failed to fetch information' });
  }
};


/**
 * Controller to create a new information entry.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Sends a JSON response with the created information.
 */
exports.createInformation = async (req, res) => {
  const { listName } = req.params; // Extract listName from the URL parameters

  try {
    // Retrieve the website ID from the session
    const websiteId = req.session.user?.website_id;

    // Check if the website ID is present in the session
    if (!websiteId) {
      return res.status(400).json({ error: 'Website ID not found in session.' });
    }

    // Get the data from the request body to create the new record
    const data = req.body;

    // Create the new information entry using the service layer
    const newInformation = await informationService.createInformation(listName, websiteId, data);

    // Send a successful response with the created information
    res.status(201).json(newInformation);
  } catch (error) {
    // Log the error and send a 500 response if something goes wrong
    console.error('Error creating information:', error);
    res.status(500).json({ error: 'Failed to create information' });
  }
};


/**
 * Controller to update an existing information entry.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Sends a JSON response with the update result.
 */
exports.updateInformation = async (req, res) => {
  const { id, listName } = req.params; // Extract the primary key ID and listName from the URL parameters
  const websiteId = req.session.user?.website_id; // Get the website ID from the session
  const data = req.body; // Get the data to update from the request body

  try {
    // Check if the website ID is present in the session
    if (!websiteId) {
      return res.status(400).json({ error: 'Website ID not found in session.' });
    }

    // Update the information entry using the service layer
    const updatedInformation = await informationService.updateInformation(listName, id, websiteId, data);

    // Send a successful response with the result of the update
    res.json(updatedInformation);
  } catch (error) {
    // Log the error and send a 500 response if something goes wrong
    console.error('Error updating information:', error);
    res.status(500).json({ error: 'Failed to update information' });
  }
};


/**
 * Controller to delete an information entry.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Sends a JSON response with the delete result.
 */
exports.deleteInformation = async (req, res) => {
  const { id, listName } = req.params; // Extract the primary key ID and listName from the URL parameters
  const websiteId = req.session.user?.website_id; // Get the website ID from the session

  try {
    // Check if the website ID is present in the session
    if (!websiteId) {
      return res.status(400).json({ status: 'error', message: 'Website ID not found in session.' });
    }

    // Delete the information entry using the service layer
    const result = await informationService.deleteInformation(listName, id, websiteId);

    // Send a successful response with the result of the delete operation
    return res.status(result.statusCode).json({ status: result.status, message: result.message });
  } catch (error) {
    // Log the error and send a 500 response if something goes wrong
    console.error('Error deleting information:', error.message);
    return res.status(500).json({ status: 'error', message: 'Failed to delete information' });
  }
};