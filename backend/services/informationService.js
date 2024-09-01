const { sequelize } = require('../models');
const formService = require('./formService');
const listService = require('./listService')
const { formatDatesInJson } = require('../utils/dateUtils');
const formValidator = require('../validators/formValidator');


/**
 * Fetches a list of information records by website ID.
 *
 * @param {string} formName - The name of the form.
 * @param {number|string} websiteId - The website ID.
 * @param {number} limit - The number of records to retrieve.
 * @param {number} offset - The number of records to skip.
 * @returns {Promise<Object>} - An object containing the count of records and the retrieved information rows.
 * @throws {Error} - If any error occurs during retrieval.
 */
exports.getInformationListByWebsite = async (formName, websiteId, limit = 12, offset = 0, sortOptions = {}, searchConditions = {}) => {
  try {
    // Get the primary key column name for the given form
    const primaryKeyColumn = await formService.getPrimaryKeyColumn(formName);
    
    // Get the table name and where clause for the given form
    const { table_name, where_clause } = await listService.getTableAndWhereClause(formName);

    // Get the column names for the given form
    const columns = await listService.getColumnNamesByListName(formName);

    // Get searchable columns
    const searchableColumns = await formService.getSearchableColumns(formName);

    // Build the WHERE clause for search conditions
    const { whereClause: searchWhereClause, replacements: searchReplacements } = buildWhereClause(searchConditions, searchableColumns);

    // Build the ORDER BY clause based on the sortOptions
    let orderByClause = '';
    if (Object.keys(sortOptions).length > 0) {
      const orderClauses = Object.entries(sortOptions)
        .filter(([column]) => columns.includes(column))  // Ensure column is valid
        .map(([column, order]) => `${column} ${order}`);
      if (orderClauses.length > 0) {
        orderByClause = `ORDER BY ${orderClauses.join(', ')}`;
      }
    }

    // Default to ORDER BY last_update_date DESC if no valid orderByClause is built
    if (!orderByClause) {
      orderByClause = 'ORDER BY last_update_date DESC';
    }

    // Combine the where clause with search conditions and where_clause from listService
    const finalWhereClause = `website_id = :websiteId ${where_clause ? `AND ${where_clause}` : ''} ${searchWhereClause}`;

    // Construct the SQL query with the dynamic ORDER BY clause and search WHERE clause
    const query = `
      SELECT ${columns.join(', ')}
      FROM ${table_name}
      WHERE ${finalWhereClause}
      ${orderByClause}
      LIMIT :offset, :limit
    `;

    // Combine the replacements for the where_clause and search conditions
    const replacements = {
      websiteId, 
      limit, 
      offset, 
      ...searchReplacements
    };

    // Execute the query with the provided website ID, limit, offset, and search conditions
    const results = await sequelize.query(query, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    // Return the count of records, the primary key column name, and the retrieved rows
    return { count: results.length, primaryKeyColumn, rows: results };
  } catch (error) {
    console.error('Error fetching information list:', error);
    throw new Error('Failed to fetch information list');
  }
};


/**
 * Fetches information by primary key and website ID.
 *
 * @param {string} formName - The name of the form.
 * @param {number|string} id - The primary key value.
 * @param {number|string} websiteId - The website ID.
 * @returns {Promise<Object>} - The retrieved information record.
 * @throws {Error} - If the information is not found or if an error occurs during retrieval.
 */
exports.getInformationByPrimaryKeyAndWebsite = async (formName, id, websiteId) => {
  try {
    // Get the primary key column name for the given form
    const primaryKeyColumn = await formService.getPrimaryKeyColumn(formName);

    // Get the table name and where clause for the given form
    const { table_name, where_clause } = await listService.getTableAndWhereClause(formName);

    // Get the column names using the new function
    const columns = await formService.getColumnNamesByFormName(formName);

    // Construct the SQL query
    const query = `
      SELECT ${columns.join(', ')}
      FROM ${table_name}
      WHERE ${primaryKeyColumn} = :id AND website_id = :websiteId ${where_clause ? `AND ${where_clause}` : ''}
    `;

    // Execute the query with the provided ID and website ID
    const results = await sequelize.query(query, {
      replacements: { id, websiteId },
      type: sequelize.QueryTypes.SELECT,
    });

    // Check if any results were returned
    if (!results.length) {
      throw new Error('Information not found for the given ID and website.');
    }

    // Return the first result as we're looking for a specific record
    return results[0];
  } catch (error) {
    console.error('Error fetching information:', error);
    throw new Error('Failed to fetch information');
  }
};


/**
 * Creates a new information entry dynamically based on form name.
 *
 * @param {string} formName - The name of the form.
 * @param {number|string} websiteId - The website ID.
 * @param {Object} data - The data to be inserted.
 * @returns {Promise<Object>} - The newly created information record.
 * @throws {Error} - If an error occurs during the creation.
 */
exports.createInformation = async (formName, websiteId, data) => {
  try {

    // Fetch form details with the required flag
    const formDetails = await formService.getFormDetailsWithRequiredFlag(formName);

    // Validate required fields using the validator
    formValidator.validateRequiredFields(formDetails, data);

    // Get the table name and primary key column for the given form
    const { table_name } = await listService.getTableAndWhereClause(formName);
    const primaryKeyColumn = await formService.getPrimaryKeyColumn(formName);

    // Format any date fields in the data object
    data = formatDatesInJson(data);

    // Process each column in formDetails that has a lov_sql_convert_out
    for (const detail of formDetails) {
      if (detail.lovSqlConvertOut) {
        // Dynamically determine the last parameter to pass
        const lastParameterName = extractLastParameter(detail.lovSqlConvertOut);
        const replacementValue = data[lastParameterName];
      
        if (!replacementValue) {
          throw new Error(`The value for ${lastParameterName} is missing in the data.`);
        }
      
        const dynamicReplacement = { websiteId, [lastParameterName]: replacementValue };
      
        const dynamicResult = await executeLovSqlConvertOut(
          detail.lovSqlConvertOut,
          dynamicReplacement
        );
      
        console.log(`${lastParameterName} retrieved:`, dynamicResult);
        data[detail.columnName] = dynamicResult; // Assign the result to the correct column
      }
    }

    // Fetch the maximum primary key value for the given website ID
    const maxResult = await sequelize.query(
      `SELECT MAX(${primaryKeyColumn}) AS maxId FROM ${table_name} WHERE website_id = :websiteId`,
      {
        replacements: { websiteId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Calculate the new primary key value
    const newPrimaryKeyValue = (maxResult[0]?.maxId || 0) + 1;

    // Set the new primary key and website ID in the data object
    data[primaryKeyColumn] = newPrimaryKeyValue;
    data.website_id = websiteId;

    // Construct the SQL query for inserting the new record
    const fields = Object.keys(data).join(', ');
    const values = Object.keys(data).map((key) => `:${key}`).join(', ');

    const query = `
      INSERT INTO ${table_name} (${fields})
      VALUES (${values})
    `;

    // Execute the insert query
    await sequelize.query(query, {
      replacements: data,
      type: sequelize.QueryTypes.INSERT,
    });

    return {
      status: 'success',
      message: 'Resource created successfully',
      data: { [primaryKeyColumn]: newPrimaryKeyValue, ...data },
    };
  } catch (error) {
    console.error('Error creating information:', error);
    throw new Error('Failed to create information');
  }
};


/**
 * Updates an existing information entry dynamically based on form name.
 *
 * @param {string} formName - The name of the form.
 * @param {number|string} id - The primary key value.
 * @param {number|string} websiteId - The website ID.
 * @param {Object} data - The data to be updated.
 * @returns {Promise<Object>} - The result of the update operation.
 * @throws {Error} - If an error occurs during the update or the record is not found.
 */
exports.updateInformation = async (formName, id, websiteId, data) => {
  try {

    // Fetch form details with the required flag
    const formDetails = await formService.getFormDetailsWithRequiredFlag(formName);

    // Validate required fields using the validator
    formValidator.validateRequiredFields(formDetails, data);
    
    // Get the table name and primary key column for the given form
    const { table_name } = await listService.getTableAndWhereClause(formName);
    const primaryKeyColumn = await formService.getPrimaryKeyColumn(formName);

    // Format any date fields in the data object
    data = formatDatesInJson(data);

    // Process each column in formDetails that has a lov_sql_convert_out
    for (const detail of formDetails) {
      if (detail.lovSqlConvertOut) {
        // Dynamically determine the last parameter to pass
        const lastParameterName = extractLastParameter(detail.lovSqlConvertOut);
        const replacementValue = data[lastParameterName];
      
        if (!replacementValue) {
          throw new Error(`The value for ${lastParameterName} is missing in the data.`);
        }
      
        const dynamicReplacement = { websiteId, [lastParameterName]: replacementValue };
      
        const dynamicResult = await executeLovSqlConvertOut(
          detail.lovSqlConvertOut,
          dynamicReplacement
        );
      
        console.log(`${lastParameterName} retrieved:`, dynamicResult);
        data[detail.columnName] = dynamicResult; // Assign the result to the correct column
      }
    }

    // Construct the SQL query for updating the record
    const setClause = Object.keys(data).map((key) => `${key} = :${key}`).join(', ');

    const query = `
      UPDATE ${table_name}
      SET ${setClause}
      WHERE ${primaryKeyColumn} = :id AND website_id = :websiteId
    `;

    // Execute the update query
    const [affectedRows] = await sequelize.query(query, {
      replacements: { id, websiteId, ...data },
      type: sequelize.QueryTypes.UPDATE,
    });

    let message;
    if (affectedRows === 0) {
      // Check if the record exists
      const existingRecord = await this.getInformationByPrimaryKeyAndWebsite(formName, id, websiteId);

      if (!existingRecord) {
        throw new Error('Information not found');
      } else {
        message = 'No changes were made as the data is identical to the existing record';
      }
    } else {
      message = 'Resource updated successfully';
    }

    return {
      status: 'success',
      message,
      affectedRows,
    };
  } catch (error) {
    console.error('Error updating information:', error);
    throw new Error('Failed to update information');
  }
};


/**
 * Deletes an information entry dynamically based on form name.
 *
 * @param {string} formName - The name of the form.
 * @param {number|string} id - The primary key value.
 * @param {number|string} websiteId - The website ID.
 * @returns {Promise<Object>} - The result of the delete operation.
 * @throws {Error} - If an error occurs during the deletion or the record is not found.
 */
exports.deleteInformation = async (formName, id, websiteId) => {
  try {
    // Get the table name and primary key column for the given form
    const { table_name } = await listService.getTableAndWhereClause(formName);
    const primaryKeyColumn = await formService.getPrimaryKeyColumn(formName);

    // Construct the SQL query for deleting the record
    const query = `
      DELETE FROM ${table_name}
      WHERE ${primaryKeyColumn} = :id AND website_id = :websiteId
    `;

    // Execute the delete query using raw query
    const result = await sequelize.query(query, {
      replacements: { id, websiteId },
      type: sequelize.QueryTypes.RAW, // Use RAW for manual query execution
    });

    // Extract affectedRows from the first ResultSetHeader in the result array
    const affectedRows = result && result[0] && result[0].affectedRows ? result[0].affectedRows : 0;

    // Check the number of affected rows
    if (affectedRows === 0) {
      return { status: 'error', message: 'Information not found', statusCode: 404 };
    }

    return { status: 'success', message: 'Resource deleted successfully', statusCode: 200 };
  } catch (error) {
    console.error('Error deleting information:', error);
    throw new Error('Failed to delete information');
  }
};

/**
 * Executes the `lov_sql_convert_out` query and returns the resulting value.
 *
 * This function dynamically executes a SQL query that is passed to it, replacing both
 * `?paramName` and `:paramName` styles of parameters with Sequelize's replacement syntax.
 * The function also handles the replacement of `{website_id}` with the actual website ID.
 * It logs the raw SQL query and the replacement values before execution. The result is
 * expected to contain one column, which is returned as the result of this function.
 *
 * @param {string} sqlQuery - The SQL query to execute. It can include parameters in either `?paramName` or `:paramName` format.
 * @param {Object} replacements - An object containing the values to replace in the SQL query.
 *                                The keys should match the parameter names used in the query.
 * @returns {Promise<number>} - The resulting value from the executed query, typically corresponding to a specific ID or key.
 * @throws {Error} - If the SQL query fails to execute, or if no result is found for the provided parameters.
 */
async function executeLovSqlConvertOut(sqlQuery, replacements) {
  try {
    if (!sqlQuery) {
      throw new Error('The SQL query for lov_sql_convert_out is undefined or null.');
    }

    // Replace both `?paramName` and `:paramName` patterns with Sequelize's replacement syntax `:paramName`
    sqlQuery = sqlQuery.replace(/\?(\w+)/g, ':$1');  // Replace `?paramName` with `:paramName`

    // Extract the last parameter name from the query (supporting both `?` and `:` styles)
    const lastParameterName = extractLastParameter(sqlQuery);
    if (!lastParameterName) {
      throw new Error('No parameter found in the SQL query.');
    }

    // Log the raw SQL query and replacements
    console.log('Raw SQL Query:', sqlQuery);
    console.log('Replacements before replace:', replacements);

    // Replace `{website_id}` in the query with the actual website ID
    sqlQuery = sqlQuery.replace(/{website_id}/g, replacements.websiteId);

    // Check if the last parameter exists in replacements
    if (!replacements[lastParameterName]) {
      throw new Error(`Replacement value for parameter ${lastParameterName} is missing.`);
    }

    // Execute the query with the provided replacements
    const result = await sequelize.query(sqlQuery, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    // Log the result to see what is being returned
    console.log('Query Result:', result);

    // Check if the result is valid and not empty
    if (!result || result.length === 0) {
      console.error('No result returned from lov_sql_convert_out query');
      throw new Error('No result found for the provided parameters.');
    }

    // Accessing the value of the first column in the result
    const columnName = Object.keys(result[0])[0];
    console.log('Column Name:', columnName);  // Log the column name to verify

    // Returning the actual value
    return result[0][columnName];
  } catch (error) {
    console.error('Error executing lov_sql_convert_out:', error);
    throw new Error('Failed to execute lov_sql_convert_out');
  }
}

/**
 * Extracts the last parameter name from a SQL query string.
 *
 * This function searches the provided SQL query for parameters that are defined using either
 * `?paramName` or `:paramName` syntax. It returns the last parameter name found in the query.
 *
 * @param {string} sqlQuery - The SQL query string to search for parameters.
 * @returns {string|null} - The name of the last parameter found in the query, or `null` if no parameters are found.
 */
function extractLastParameter(sqlQuery) {
  // Match both `?paramName` and `:paramName` patterns
  const matches = [...sqlQuery.matchAll(/[:?](\w+)\b/g)];
  const lastMatch = matches[matches.length - 1];
  
  if (lastMatch) {
    console.log(`Extracted parameter: ${lastMatch[1]}`);
    return lastMatch[1];
  } else {
    console.error('No named parameters found in the SQL query.');
    return null;
  }
}


/**
 * Builds a dynamic WHERE clause based on the search conditions provided.
 *
 * @param {Object} searchConditions - An object containing search conditions for each column.
 * @param {Array<string>} searchableColumns - An array of columns that can be searched.
 * @returns {Object} - An object containing the where clause and replacements for the query.
 */
const buildWhereClause = (searchConditions, searchableColumns) => {
  const whereClauses = [];
  const replacements = {};

  Object.entries(searchConditions).forEach(([column, condition]) => {
    if (searchableColumns.includes(column) && condition.operator && condition.value !== undefined) {
      let clause = '';

      switch (condition.operator.toUpperCase()) { // Handle case insensitivity for operators
        case '=':
        case '<>':
        case '<':
        case '>':
        case '<=':
        case '>=':
          clause = `${column} ${condition.operator} :${column}`;
          replacements[column] = condition.value;
          break;
        case 'LIKE':
        case 'NOT LIKE':
          clause = `${column} ${condition.operator.toUpperCase()} :${column}`;
          replacements[column] = condition.value;  // You may want to add wildcards around the value if required
          break;
        case 'IS BLANK':
          clause = `${column} IS NULL OR ${column} = ''`;
          break;
        case 'IS NOT BLANK':
          clause = `${column} IS NOT NULL AND ${column} <> ''`;
          break;
        default:
          throw new Error(`Unsupported operator: ${condition.operator}`);
      }

      whereClauses.push(clause);
    }
  });

  const whereClause = whereClauses.length > 0 ? `AND (${whereClauses.join(' AND ')})` : '';
  return { whereClause, replacements };
};