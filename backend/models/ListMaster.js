module.exports = (sequelize, DataTypes) => {
    const ListMaster = sequelize.define('ListMaster', {
      list_master_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      list_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      delete_message: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      table_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      delete_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      where_clause: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      order_by: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      form_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      hierarchy_level: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      custom_link_name1: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      custom_link_url1: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      link_static1: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      hierarchy_level_column2: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      hierarchy_level_column_script: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      order_by_user: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      search_allow_flag: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      sort_allow_flag: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      update_allow_flag: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      script_static_column1: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      script_static_file1: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      script_dynamic_column1: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      insert_allow_flag: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      table_width: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 750,
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
      tableName: 'sys_lists_master',
      timestamps: false,
    });
  
    return ListMaster;
  };
  