// middleware/normalizeData.js
function normalizeData(req, res, next) {
    // Function to recursively convert empty strings to null
    const convertEmptyStringsToNull = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'string' && obj[key].trim() === '') {
          obj[key] = null;
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          convertEmptyStringsToNull(obj[key]);
        }
      }
    };
  
    if (req.body) {
      convertEmptyStringsToNull(req.body);
    }
  
    next();
  }
  
  module.exports = normalizeData;
  