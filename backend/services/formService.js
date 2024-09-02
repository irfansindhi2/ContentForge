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
 * Retrieves comprehensive form details including primary key column, searchable columns, all active column names, required flag, and lov_sql_convert_out.
 *
 * @param {string} formName - The name of the form.
 * @returns {Promise<Object>} - An object containing the primary key column name, an array of searchable column names, an array of all active column names, and form details with required flags and lov_sql_convert_out.
 * @throws {Error} - If the form master or required columns are not found, or if an error occurs during retrieval.
 */
exports.getFormDetails = async (formName) => {
  try {
    // Retrieve the form master by name
    const formMaster = await FormMaster.findOne({
      where: { name: formName },
      include: [{
        model: FormDetails,
        attributes: ['column_name', 'key_type', 'search_flag', 'required_flag', 'lov_sql_convert_out'],
        where: { active: 'Yes' },
      }],
    });

    if (!formMaster || !formMaster.FormDetails.length) {
      throw new Error(`FormMaster entry or active FormDetails for form name ${formName} not found`);
    }

    // Extract the primary key column
    const primaryKeyColumn = formMaster.FormDetails.find(detail => detail.key_type === 'Primary');
    if (!primaryKeyColumn) {
      throw new Error('Primary key column not found');
    }

    // Extract the searchable columns
    const searchableColumns = formMaster.FormDetails
      .filter(detail => detail.search_flag === 'Yes')
      .map(detail => detail.column_name);

    // Extract all active columns
    const allActiveColumns = formMaster.FormDetails.map(detail => detail.column_name);

    // Extract form details with required flag and lov_sql_convert_out
    const formDetailsWithFlags = formMaster.FormDetails.map(detail => ({
      columnName: detail.column_name,
      isRequired: detail.required_flag === 'Yes',
      lovSqlConvertOut: detail.lov_sql_convert_out || null, // Include lov_sql_convert_out if present
    }));

    return {
      primaryKeyColumn: primaryKeyColumn.column_name,
      searchableColumns,
      allActiveColumns,
      formDetailsWithFlags,
    };
  } catch (error) {
    console.error('Error fetching comprehensive form details:', error);
    throw new Error('Failed to fetch comprehensive form details');
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