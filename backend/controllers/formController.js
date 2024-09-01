const formService = require('../services/formService');

/**
 * Controller to fetch form details by form name and ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Sends a JSON response with the retrieved form details.
 */
exports.getFormDetailsByName = async (req, res) => {
  const { formName } = req.params; // Extract formName from the URL parameters
  const { id } = req.query; // Extract id from the query parameters

  try {
    // Retrieve the website ID from the session
    const websiteId = req.session.user?.website_id;

    // Check if website ID is available in the session
    if (!websiteId) {
      return res.status(401).json({ error: 'Unauthorized: No website ID in session' });
    }

    // Fetch the form details from the service layer, including processing of any `lov_sql` and `lov_sql_convert_in`
    const { formMaster, formDetails } = await formService.getFormDetailsByName(formName, websiteId, id);

    // Send a successful response with the retrieved form details
    res.json({ formMaster, formDetails });
  } catch (error) {
    // Log the error and send a 500 response if something goes wrong
    console.error('Error fetching form details:', error);
    res.status(500).json({ error: 'Failed to fetch form details' });
  }
};