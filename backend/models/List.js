module.exports = (sequelize, DataTypes) => {
    const List = sequelize.define('List', {
      list_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      active: {
        type: DataTypes.STRING(3),
        allowNull: true,
        defaultValue: 'Yes',
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      creation_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      last_updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      last_update_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    }, {
      freezeTableName: true,
      tableName: 'sys_lists',
      timestamps: false,
    });
  
    return List;
  };
  