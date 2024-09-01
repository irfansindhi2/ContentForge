const { FormMaster, FormDetails } = require('../models');
const { sequelize } = require('../models');


/**
 * Retrieves form details by form name and processes any `lov_sql` and `lov_sql_convert_in` into a list of options.
 *
 * @param {string} formName - The name of the form.
 * @param {number|string} websiteId - The website ID to be used in SQL queries.
 * @param {number|string} [id] - The ID of the specific form entry (optional, used only for `lov_sql_convert_in`).
 * @returns {Promise<Object>} - An object containing the form master, form details, and any processed `lov_sql` and `lov_sql_convert_in` options.
 * @throws {Error} - If the form master is not found or if an error occurs during retrieval.
 */
exports.getFormDetailsByName = async (formName, websiteId, id) => {
  try {
    // Retrieve the form master by name
    const formMaster = await FormMaster.findOne({
      where: { name: formName },
    });

    if (!formMaster) {
      throw new Error('Form Master not found');
    }

    // Retrieve the primary key column name
    const primaryKeyDetail = await FormDetails.findOne({
      where: { form_master_id: formMaster.form_master_id, key_type: "Primary", active: 'Yes' },
      attributes: ['column_name'],
    });

    if (!primaryKeyDetail) {
      throw new Error('Primary key column not found');
    }

    const primaryKeyColumn = primaryKeyDetail.column_name;

    // Retrieve form details ordered by order_sequence
    const formDetails = await FormDetails.findAll({
      where: { form_master_id: formMaster.form_master_id, active: 'Yes' },
      order: [['order_sequence', 'ASC']],
    });

    // Process any `lov_sql` and `lov_sql_convert_in` in the form details
    for (let detail of formDetails) {
      // Process lov_sql if it exists
      if (detail.lov_sql) {
        // Replace {website_id} with the actual website ID in lov_sql
        let sqlQuery = detail.lov_sql.replace(/{website_id}/g, websiteId);

        // Replace ISNULL with IFNULL in the SQL query
        sqlQuery = sqlQuery.replace(/\bISNULL\b/gi, 'IFNULL');

        // Execute the query and get the results
        const results = await sequelize.query(sqlQuery, {
          type: sequelize.QueryTypes.SELECT,
        });

        // Assuming the query returns a single column, convert it into a list of options
        const columnName = Object.keys(results[0] || {})[0];

        // Update the `lov_sql` field with the processed options
        detail.lov_sql = results.map(row => row[columnName]);
      }

      // Process lov_sql_convert_in if it exists and only if the id is provided
      if (id) {
        if (detail.lov_sql_convert_in) {
          // Replace {website_id} with the actual website ID in lov_sql_convert_in
          let sqlQueryConvert = detail.lov_sql_convert_in
            .replace(/{website_id}/g, websiteId)
            .replace(new RegExp(`\\?${primaryKeyColumn}\\b`, 'gi'), id); // Replace the placeholder with the actual ID

          // Replace ISNULL with IFNULL in the SQL query
          sqlQueryConvert = sqlQueryConvert.replace(/\bISNULL\b/gi, 'IFNULL');

          // Execute the query and get the results
          const resultsConvert = await sequelize.query(sqlQueryConvert, {
            type: sequelize.QueryTypes.SELECT,
          });

          // Assuming the query returns a single column and one row, convert it into a string
          const columnNameConvert = Object.keys(resultsConvert[0] || {})[0];
          detail.lov_sql_convert_in = resultsConvert.length > 0 ? resultsConvert[0][columnNameConvert] : '';
        }
      } else {
        // If no ID is provided, remove or nullify lov_sql_convert_in
        detail.lov_sql_convert_in = null;
      }
    }

    return { formMaster, formDetails };
  } catch (error) {
    console.error('Error fetching form details:', error);
    throw new Error('Failed to fetch form details');
  }
};


/**
 * Retrieves the primary key column name for a given form.
 *
 * @param {string} formName - The name of the form.
 * @returns {Promise<string>} - The name of the primary key column.
 * @throws {Error} - If the form master or primary key column is not found, or if an error occurs during retrieval.
 */
exports.getPrimaryKeyColumn = async (formName) => {
  try {
    // Retrieve the form master by name
    const formMaster = await FormMaster.findOne({
      where: { name: formName },
    });

    if (!formMaster) {
      throw new Error('Form Master not found');
    }

    // Retrieve form details where key_type is "Primary"
    const primaryKeyColumn = await FormDetails.findOne({
      where: { form_master_id: formMaster.form_master_id, key_type: "Primary", active: 'Yes' },
      attributes: ['column_name'],
    });

    if (!primaryKeyColumn) {
      throw new Error('Primary key column not found');
    }

    return primaryKeyColumn.column_name;
  } catch (error) {
    console.error('Error fetching primary key column:', error);
    throw new Error('Failed to fetch primary key column');
  }
};

/**
 * Retrieves form details including the required flag for a given form.
 *
 * @param {string} formName - The name of the form.
 * @returns {Promise<Object[]>} - An array of objects containing column names and their required flag status.
 * @throws {Error} - If any error occurs during retrieval.
 */
exports.getFormDetailsWithRequiredFlag = async (formName) => {
  try {
    // Retrieve the form master by name
    const formMaster = await FormMaster.findOne({
      where: { name: formName },
    });

    if (!formMaster) {
      throw new Error('Form Master not found');
    }

    // Retrieve form details, including the required flag and lov_sql_convert_out, ordered by order_sequence
    const formDetails = await FormDetails.findAll({
      where: { form_master_id: formMaster.form_master_id, active: 'Yes' },
      attributes: ['column_name', 'required_flag', 'lov_sql_convert_out'],
    });

    // Debug log to check if lov_sql_convert_out is retrieved
    console.log('Form Details with lov_sql_convert_out:', formDetails);

    // Map the results to a more convenient format
    return formDetails.map(detail => ({
      columnName: detail.column_name,
      isRequired: detail.required_flag === 'Yes',
      lovSqlConvertOut: detail.lov_sql_convert_out || null, // Include lov_sql_convert_out if present
    }));
  } catch (error) {
    console.error('Error fetching form details with required flag:', error);
    throw new Error('Failed to fetch form details with required flag');
  }
};

/**
 * Retrieves the column names based on the provided formName.
 *
 * @param {string} formName - The name of the form for which to retrieve the column names.
 * @returns {Promise<Array<string>>} - An array of column names.
 * @throws {Error} - If the formName is not found or any error occurs during retrieval.
 */
exports.getColumnNamesByFormName = async (formName) => {
  try {
    // Fetch the FormMaster entry corresponding to the formName
    const formMaster = await FormMaster.findOne({
      where: { name: formName },
      include: [{
        model: FormDetails,
        attributes: ['column_name'],
        where: { active: 'Yes' },
      }],
    });

    // Check if the FormMaster entry was found
    if (!formMaster || !formMaster.FormDetails.length) {
      throw new Error(`FormMaster entry or active FormDetails for form name ${formName} not found`);
    }

    // Extract and return column names from FormDetails
    const columns = formMaster.FormDetails.map(detail => detail.column_name);
    return columns;
  } catch (error) {
    // Log the error and rethrow it for the calling function to handle
    console.error('Error retrieving column names:', error);
    throw new Error('Failed to retrieve column names');
  }
};

/**
 * Executes a SQL query from the lov_sql field and returns the options.
 *
 * @param {string} sqlQuery - The SQL query to execute.
 * @param {Object} replacements - An object containing the parameters to replace in the SQL query.
 * @returns {Promise<Array<string>>} - An array of options resulting from the SQL query.
 * @throws {Error} - If the SQL query fails to execute.
 */
exports.getOptionsFromLovSql = async (sqlQuery, replacements) => {
  try {
    // Execute the SQL query with replacements
    const [results] = await sequelize.query(sqlQuery, {
      replacements, // Object containing parameters like { website_id: someValue }
      type: sequelize.QueryTypes.SELECT,
    });

    // Assuming that there is only one column in the result, which can be named anything
    const columnNames = Object.keys(results[0] || {});
    if (columnNames.length !== 1) {
      throw new Error('Unexpected number of columns in SQL result. Expected exactly one.');
    }

    const columnName = columnNames[0];

    // Extract the values from the result and return them as an array of strings
    return results.map(row => row[columnName]);
  } catch (error) {
    console.error('Error executing SQL query:', error);
    throw new Error('Failed to execute SQL query');
  }
};

/**
 * Retrieves the columns that have the search_flag set to 'Yes'.
 *
 * @param {string} formName - The name of the form.
 * @returns {Promise<Array<string>>} - An array of column names that can be searched.
 * @throws {Error} - If an error occurs during retrieval.
 */
exports.getSearchableColumns = async (formName) => {
  try {
    const formMaster = await FormMaster.findOne({
      where: { name: formName },
      include: [{
        model: FormDetails,
        attributes: ['column_name'],
        where: { active: 'Yes', search_flag: 'Yes' },
      }],
    });

    if (!formMaster || !formMaster.FormDetails.length) {
      throw new Error(`FormMaster entry or searchable FormDetails for form name ${formName} not found`);
    }

    return formMaster.FormDetails.map(detail => detail.column_name);
  } catch (error) {
    console.error('Error fetching searchable columns:', error);
    throw new Error('Failed to fetch searchable columns');
  }
};