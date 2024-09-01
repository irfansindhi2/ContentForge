module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    website_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(25),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    // Additional fields...
  }, {
    freezeTableName: true,  // Prevent Sequelize from pluralizing the table name
    tableName: 'sys_users',  // Explicitly set the table name to 'sys_users'
    timestamps: false,  // Disable automatic `createdAt` and `updatedAt` columns
    hasPrimaryKey: false,
  });

  // Remove the auto-generated `id` attribute
  User.removeAttribute('id');

  return User;
};
