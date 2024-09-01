// middleware/authMiddleware.js

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();  // The user is authenticated, proceed
  } else {
    return res.status(401).json({ error: 'Unauthorized' });  // Respond with 401 if not authenticated
  }
};

module.exports = { isAuthenticated };