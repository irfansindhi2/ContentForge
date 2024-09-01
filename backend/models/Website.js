module.exports = (sequelize, DataTypes) => {
    const Website = sequelize.define('Website', {
      website_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      website: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,  // Assuming the site name is unique
      },
      // Add other fields if needed
    }, {
      freezeTableName: true,  // Prevent Sequelize from pluralizing the table name
      tableName: 'sys_websites',  // Explicitly set the table name to 'sys_websites'
      timestamps: false, // Disable automatic `createdAt` and `updatedAt` columns
    });
  
    return Website;
  };
  