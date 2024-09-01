module.exports = (sequelize, DataTypes) => {
    const FormMaster = sequelize.define('FormMaster', {
      form_master_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      table_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      column_width_caption: {
        type: DataTypes.STRING(5),
        allowNull: true,
      },
      column_width_data: {
        type: DataTypes.STRING(5),
        allowNull: true,
      },
      hierarchy_level: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      script_file_before: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      script_file1: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      special_active_column_flag: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      header: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      footer: {
        type: DataTypes.STRING(1000),
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
      tableName: 'sys_forms_master',
      timestamps: false,
    });
  
    return FormMaster;
  };
  