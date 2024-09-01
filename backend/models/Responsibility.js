module.exports = (sequelize, DataTypes) => {
    const Responsibility = sequelize.define('Responsibility', {
      sys_responsibility_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      name_display: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      link: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      active: {
        type: DataTypes.STRING(3),
        allowNull: false,
      },
      order_sequence: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: false,
      },
      // Add other fields as necessary
    }, {
      freezeTableName: true,
      tableName: 'sys_responsibilities',
      timestamps: false,
    });
  
    return Responsibility;
  };
  