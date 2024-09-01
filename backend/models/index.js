const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Initialize Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: console.log,  // Enable query logging to see the actual SQL being executed
});

// Load models
const User = require('./User')(sequelize, DataTypes);
const Website = require('./Website')(sequelize, DataTypes);
const Responsibility = require('./Responsibility')(sequelize, DataTypes);
const List = require('./List')(sequelize, DataTypes);
const ListMaster = require('./ListMaster')(sequelize, DataTypes);
const ListDetails = require('./ListDetails')(sequelize, DataTypes);
const FormMaster = require('./FormMaster')(sequelize, DataTypes);
const FormDetails = require('./FormDetails')(sequelize, DataTypes);

// Associations
List.hasMany(ListMaster, { foreignKey: 'list_id' });

ListMaster.belongsTo(List, { foreignKey: 'list_id' });
ListMaster.hasMany(ListDetails, { foreignKey: 'list_master_id' });
ListDetails.belongsTo(ListMaster, { foreignKey: 'list_master_id' });

// Define associations for FormMaster and FormDetails
FormMaster.hasMany(FormDetails, { foreignKey: 'form_master_id'});
FormDetails.belongsTo(FormMaster, { foreignKey: 'form_master_id'});

// Export models and sequelize connection
const db = {
  sequelize,  // Ensure you export sequelize here
  Sequelize,
  User,
  Website,
  Responsibility,
  List,
  ListMaster,
  ListDetails,
  FormMaster,
  FormDetails,
};

module.exports = db;
