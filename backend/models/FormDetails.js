module.exports = (sequelize, DataTypes) => {
    const FormDetails = sequelize.define('FormDetails', {
      form_detail_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      form_master_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      column_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      caption: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      input_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      input_type_ole: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      input_case: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      exclude_characters: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      input_length: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      display_length: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      display_width: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      default_value: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      required_flag: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      data_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      data_size: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      value_minimum_number: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },
      value_maximum_number: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },
      value_minimum_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      value_maximum_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      hidden_flag: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      search_flag: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      order_flag: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      check_box_display_flag: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      order_sequence: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
        defaultValue: 0.0000,
      },
      key_type: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      composit_key_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      lov_sql: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      lov_static: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      lov_sql_convert_in: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      lov_sql_convert_out: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      update_allow_flag: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      service_package_insert_flag: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      help: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      help_tip: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      delete_space_between_words_flag: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      custom_font_face_flag: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      override_default_values_flag: {
        type: DataTypes.STRING(3),
        allowNull: true,
        defaultValue: 'No',
      },
      ignore_blank_line_flag: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      checkbox_table: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      checkbox_column: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      checkbox_table_source: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      checkbox_table_target: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      convert_html_bracket: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      convert_enter_to_br_flag: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      advanced_user_level_flag: {
        type: DataTypes.STRING(3),
        allowNull: true,
        defaultValue: 'No',
      },
      exclude_html_tags_flag: {
        type: DataTypes.STRING(3),
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
      tableName: 'sys_forms_details',
      timestamps: false,
    });
  
    return FormDetails;
  };
  