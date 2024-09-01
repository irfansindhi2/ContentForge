const { User, Website } = require('../models');  // Import User and Website models

// Function to get website_id based on the site using the Website model
const getWebsiteIdBySite = async (site) => {
  try {
    console.log(`Retrieving website_id for site: ${site}`);

    // Query the Website model to find the website by its 'website' field
    const websiteRecord = await Website.findOne({
      where: { website: site },  // Match the 'website' field with the provided site
    });

    // Check if the website record was found
    if (!websiteRecord) {
      console.error(`Website not found for site: ${site}`);
      throw new Error('Website not found');
    }

    console.log(`Website found for site: ${site}, website_id: ${websiteRecord.website_id}`);
    return websiteRecord.website_id;  // Return the website_id from the found record
  } catch (error) {
    console.error(`Error retrieving website: ${error.message}`);
    throw new Error('Error retrieving website: ' + error.message);
  }
};

// Function to handle user login using the User model
const loginUser = async (name, password, website_id) => {
  try {
    console.log(`Attempting to login user: ${name} for website_id: ${website_id}`);

    // Find the user by name and website_id
    const user = await User.findOne({ where: { name, website_id } });

    if (!user) {
      console.error(`Invalid name or website: name = ${name}, website_id = ${website_id}`);
      throw new Error('Invalid username or website.');
    }

    // Compare the entered password with the stored password
    if (password !== user.password) {
      console.error(`Invalid password for user: ${name}`);
      throw new Error('Invalid password.');
    }

    // If login is successful, return the user object
    console.log(`User authenticated successfully: ${name}`);
    return user;
  } catch (error) {
    console.error(`Error during login: ${error.message}`);
    throw new Error(`Error during login: ${error.message}`);
  }
};




module.exports = { getWebsiteIdBySite, loginUser };
