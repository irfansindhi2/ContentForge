module.exports = (sequelize, DataTypes) => {
  const ListDetails = sequelize.define('ListDetails', {
    list_detail_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    list_master_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    column_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    column_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    column_heading: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    column_width: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    alignment: {
      type: DataTypes.STRING(15),
      allowNull: true,
      defaultValue: 'Left',
    },
    primary_flag: {
      type: DataTypes.STRING(3),
      allowNull: true,
      defaultValue: 'No',
    },
    order_sequence: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true,
      defaultValue: 0.0000,
    },
    custom_font_face_flag: {
      type: DataTypes.STRING(3),
      allowNull: true,
      defaultValue: 'No',
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
    creation_date_number: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    last_update_date_number: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  }, {
    freezeTableName: true,
    tableName: 'sys_lists_details',
    timestamps: false,
  });

  return ListDetails;
};
