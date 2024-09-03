/**
 * Validates required fields for a given form.
 *
 * @param {Object[]} formDetails - The form details with column names and required flags.
 * @param {Object} data - The data to be validated.
 * @throws {Error} - If any required fields are missing or have null/empty values.
 */
exports.validateRequiredFields = (allActiveColumns, data) => {
  const missingOrInvalidFields = allActiveColumns
    .filter(field => 
      field.isRequired && 
      (!(data && Object.prototype.hasOwnProperty.call(data, field.columnName)) || 
       (data[field.columnName] !== false && data[field.columnName] !== 0 && !data[field.columnName]))
    )
    .map(field => field.columnName);

  if (missingOrInvalidFields.length > 0) {
    throw new Error(`Missing or invalid required fields: ${missingOrInvalidFields.join(', ')}`);
  }
};