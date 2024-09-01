const { Responsibility } = require('../models');

// Function to get active responsibilities
const getActiveResponsibilities = async () => {
  try {
    const responsibilities = await Responsibility.findAll({
      where: { active: 'Yes' },
      order: [['order_sequence', 'ASC']],  // Order by `order_sequence` in ascending order
    });

    return responsibilities;
  } catch (error) {
    console.error('Error fetching responsibilities:', error);
    throw new Error('Failed to fetch responsibilities');
  }
};

module.exports = { getActiveResponsibilities };
