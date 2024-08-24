const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Initialize Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false,  // Optional: disable logging for cleaner output
});

// Load models
const User = require('./user')(sequelize, DataTypes);

// Export models and sequelize connection
const db = {
  sequelize,
  Sequelize,
  User,  // Add all models here
};

module.exports = db;
