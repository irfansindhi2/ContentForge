const responsibilityService = require('../services/responsibilityService');

// Display active responsibilities
exports.getResponsibilities = async (req, res) => {
  try {
    const responsibilities = await responsibilityService.getActiveResponsibilities();
    res.json(responsibilities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch responsibilities' });
  }
};

// Add other responsibility-related actions as needed
