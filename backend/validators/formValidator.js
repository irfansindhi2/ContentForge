/**
 * Validates required fields for a given form.
 *
 * @param {Object[]} formDetails - The form details with column names and required flags.
 * @param {Object} data - The data to be validated.
 * @throws {Error} - If any required fields are missing or have null/empty values.
 */
exports.validateRequiredFields = (formDetails, data) => {
    // Filter out the required fields that are missing in the data or have null/empty values
    const missingOrInvalidFields = formDetails
      .filter(field => 
        field.isRequired && 
        (!data.hasOwnProperty(field.columnName) || data[field.columnName] == null || data[field.columnName] === '')
      )
      .map(field => field.columnName);
  
    // If there are missing or invalid fields, throw an error with the list of fields
    if (missingOrInvalidFields.length > 0) {
      throw new Error(`Missing or invalid required fields: ${missingOrInvalidFields.join(', ')}`);
    }
  };