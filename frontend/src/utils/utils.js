/**
 * Parses a static list of values (LOV) from a string format.
 *
 * @param {string} lovStatic - The static LOV string containing options.
 * @returns {string[]} - An array of parsed options.
 */
export const parseLovStatic = (lovStatic) => {
  const regex = /<OPTION>(.*?)<\/OPTION>/gi;
  let match;
  const options = [];

  while ((match = regex.exec(lovStatic)) !== null) {
    options.push(match[1].trim());
  }

  return options;
};

/**
 * Formats a date string to 'YYYY-MM-DD' format.
 *
 * @param {string} dateString - The date string to format.
 * @returns {string} - The formatted date string.
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};
  