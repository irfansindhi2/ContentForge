module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',  // Map 'createdAt' in Sequelize to 'created_at' in the database
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',  // Map 'updatedAt' in Sequelize to 'updated_at' in the database
    },
  }, {
    freezeTableName: true,  // Prevent Sequelize from pluralizing the table name
    tableName: 'users',  // Explicitly set the table name to 'users'
  });

  return User;
};
