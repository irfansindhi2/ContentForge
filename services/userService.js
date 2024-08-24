const bcrypt = require('bcryptjs');
const { User } = require('../models');  // Import the User model from the centralized db object

// Function to add a new user
const addUser = async (username, email, password) => {
  try {
    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert the new user into the database
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return newUser;
  } catch (error) {
    throw new Error('Error adding user: ' + error.message);
  }
};

// Function to handle user login
const loginUser = async (username, password) => {
  try {
    // Find the user by username
    const user = await User.findOne({ where: { username } });

    if (!user) {
      throw new Error('Invalid username or password');
    }

    // Compare the entered password with the hashed password in the database
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      throw new Error('Invalid username or password');
    }

    // If login is successful, return the user object
    return user;
  } catch (error) {
    throw new Error('Error during login: ' + error.message);
  }
};

module.exports = { addUser, loginUser };
