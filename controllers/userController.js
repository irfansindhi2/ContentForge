const express = require('express');
const router = express.Router();
const { addUser, loginUser } = require('../services/userService');  // Import the merged service

// Route to handle user registration
router.post('/admin/addUser', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const newUser = await addUser(username, email, password);
    res.status(201).json({
      message: 'User added successfully',
      user: newUser,
    });
  } catch (error) {
    console.error('Error adding user:', error);  // Log the error for debugging
    res.status(500).json({ error: error.message });
  }
});

// Route to handle user login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await loginUser(username, password);
    res.send(`Welcome, ${user.username}!`);
  } catch (error) {
    console.error('Error during login:', error);  // Log the error for debugging
    res.status(400).send(error.message);  // Send the error message as the response
  }
});

module.exports = router;
