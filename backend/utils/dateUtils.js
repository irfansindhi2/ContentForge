const moment = require('moment');

/**
 * Formats any date fields in the JSON object.
 *
 * @param {Object} obj - The JSON object containing data from the database.
 * @returns {Object} - The JSON object with formatted date fields.
 */
function formatDatesInJson(obj) {
    const formattedObj = {};

    Object.keys(obj).forEach(key => {
        const value = obj[key];

        // Check if the value is a valid date (instance of Date or ISO string)
        if (value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)))) {
            formattedObj[key] = moment(value).format('YYYY-MM-DD HH:mm:ss'); // Format as needed
        } else {
            formattedObj[key] = value; // Leave non-date fields as they are
        }
    });

    return formattedObj;
}

module.exports = { formatDatesInJson };
