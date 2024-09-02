const { List, ListMaster, ListDetails } = require('../models');


/**
 * Service function to fetch list details based on list name.
 * This is used to display the list columns on frontend.
 * 
 * @param {string} listName - The name of the list to fetch details for.
 * @returns {Promise<Object[]>} - An array of list master records with associated list details.
 * @throws {Error} - If the list is not found or if an error occurs during retrieval.
 */
exports.getListDetails = async (listName) => {
  try {
    console.log(`Fetching list details for listName: ${listName}`);
    
    // Find the list by name
    const list = await List.findOne({ where: { name: listName } });

    if (!list) {
      throw new Error('List not found');
    }

    // Fetch list master records and associated list details
    const listMasters = await ListMaster.findAll({
      where: { list_id: list.list_id },
      include: [{
        model: ListDetails,
      }],
      order: [[{ model: ListDetails }, 'order_sequence', 'ASC']],
    });

    return listMasters;
  } catch (error) {
    console.error('Error fetching list details:', error);
    throw new Error('Failed to fetch list details');
  }
};

/**
 * Retrieves the table details including table name, where clause, order by clause, form name, and column names based on the provided listName.
 *
 * @param {string} listName - The name of the form for which to retrieve the details.
 * @returns {Promise<Object>} - An object containing the table_name, where_clause, order_by, form_name, and an array of column names.
 * @throws {Error} - If the listName is not found or any error occurs during retrieval.
 */
exports.getTableDetailsWithColumns = async (listName) => {
  try {
    // Fetch the ListMaster entry corresponding to the listName
    const listMaster = await ListMaster.findOne({
      where: { name: listName, active: 'Yes' },
      attributes: ['table_name', 'where_clause', 'order_by', 'form_name'], // Retrieve the necessary columns including order_by and form_name
      include: [{
        model: ListDetails,
        attributes: ['column_name'],
        where: { active: 'Yes' },
      }],
    });

    // Check if the ListMaster entry was found
    if (!listMaster || !listMaster.ListDetails.length) {
      throw new Error(`ListMaster entry or active ListDetails for list name ${listName} not found`);
    }

    // Extract column names from ListDetails
    const columns = listMaster.ListDetails.map(detail => detail.column_name);

    // Return the table details and column names
    return {
      table_name: listMaster.table_name,
      where_clause: listMaster.where_clause || '', // Default to an empty string if no where_clause is defined
      order_by: listMaster.order_by || '', // Default to an empty string if no order_by is defined
      form_name: listMaster.form_name || '',
      columns,
    };
  } catch (error) {
    // Log the error and rethrow it for the calling function to handle
    console.error('Error retrieving table details and column names:', error);
    throw new Error('Failed to retrieve table details with columns');
  }
};