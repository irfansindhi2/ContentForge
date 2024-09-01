const cors = require('cors');
const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const db = require('./models');  // Import the centralized models and sequelize setup

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,  // Use frontend origin from .env file
  credentials: true,  // Allow credentials (cookies)
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Set up session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }  // Set to `true` if using HTTPS
}));

// Routes
const userRoutes = require('./routes/userRoutes');
const responsibilityRoutes = require('./routes/responsibilityRoutes');
const listRoutes = require('./routes/listRoutes');
const informationRoutes = require('./routes/informationRoutes');
const formRoutes = require('./routes/formRoutes');

app.use(userRoutes);
app.use(responsibilityRoutes);
app.use(listRoutes);
app.use(informationRoutes);
app.use(formRoutes);


// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Sync database and start the server
db.sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}).catch((err) => {
  console.error('Unable to connect to the database:', err);
});
