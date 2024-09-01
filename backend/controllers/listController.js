const { getListDetails } = require('../services/listService');

exports.getListDetails = async (req, res) => {
  const { listName } = req.params;

  try {
    // Fetch list details without the level parameter
    const listDetails = await getListDetails(listName);
    if (!listDetails || listDetails.length === 0) {
      return res.status(404).json({ error: 'List details not found' });
    }

    res.json(listDetails);
  } catch (error) {
    console.error('Error fetching list details:', error);
    res.status(500).json({ error: 'Failed to fetch list details' });
  }
};
