const { loginUser, getWebsiteIdBySite } = require('../services/userService');

// Handle user login
exports.login = async (req, res) => {
  const { username, password } = req.body;
  const { site } = req.query;

  try {
    const website_id = await getWebsiteIdBySite(site);

    if (!website_id) {
      throw new Error('Invalid website.');
    }

    const user = await loginUser(username, password, website_id);

    // Store user info in session after successful login
    req.session.user = { id: user.user_id, name: user.name, website_id: user.website_id };

    // Return JSON response to the frontend
    res.json({ message: 'Login successful', redirectTo: '/responsibilities' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
