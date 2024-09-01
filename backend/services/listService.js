const { List, ListMaster, ListDetails } = require('../models');


/**
 * Service function to fetch list details based on list name.
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
 * Retrieves the table name and where clause based on the provided listName.
 *
 * @param {string} listName - The name of the form for which to retrieve the table name and where clause.
 * @returns {Promise<Object>} - An object containing the table_name and where_clause.
 * @throws {Error} - If the listName is not found or any error occurs during retrieval.
 */
exports.getTableAndWhereClause = async (listName) => {
  try {
    // Fetch the ListMaster entry corresponding to the listName
    const listMaster = await ListMaster.findOne({
      where: { form_name: listName, active: 'Yes' },
      attributes: ['table_name', 'where_clause'], // Only retrieve the necessary columns
    });

    // Check if the ListMaster entry was found
    if (!listMaster) {
      throw new Error(`ListMaster entry for form name ${listName} not found`);
    }

    // Return the table name and where clause
    return {
      table_name: listMaster.table_name,
      where_clause: listMaster.where_clause || '', // Default to an empty string if no where_clause is defined
    };
  } catch (error) {
    // Log the error and rethrow it for the calling function to handle
    console.error('Error retrieving table name and where clause:', error);
    throw new Error('Failed to retrieve table name and where clause');
  }
};

/**
 * Retrieves the column names based on the provided listName.
 *
 * @param {string} listName - The name of the form for which to retrieve the column names.
 * @returns {Promise<Array<string>>} - An array of column names.
 * @throws {Error} - If the listName is not found or any error occurs during retrieval.
 */
exports.getColumnNamesByListName = async (listName) => {
  try {
    // Fetch the ListMaster entry corresponding to the listName
    const listMaster = await ListMaster.findOne({
      where: { name: listName, active: 'Yes' },
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

    // Extract and return column names from ListDetails
    const columns = listMaster.ListDetails.map(detail => detail.column_name);
    return columns;
  } catch (error) {
    // Log the error and rethrow it for the calling function to handle
    console.error('Error retrieving column names:', error);
    throw new Error('Failed to retrieve column names');
  }
};
