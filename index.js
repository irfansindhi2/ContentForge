const express = require('express');
require('dotenv').config();

const app = express();
const db = require('./models');  // Import the centralized models and sequelize setup

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Controllers
const loginController = require('./controllers/userController');
app.use(loginController);

// Root route
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Sync database and start the server
db.sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}).catch((err) => {
  console.error('Unable to connect to the database:', err);
});
