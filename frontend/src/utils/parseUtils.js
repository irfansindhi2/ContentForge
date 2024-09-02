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

  const generateImageName = () => {
    const now = new Date();
    const formattedDate = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}-${now.getMilliseconds()}`;
    return `${formattedDate}.jpg`;
  };
  