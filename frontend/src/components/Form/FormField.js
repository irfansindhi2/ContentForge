import React from 'react';
import { parseLovStatic } from '../../utils/utils';


/**
 * Component that renders a form field based on provided details.
 *
 * @param {Object} detail - The details of the form field.
 * @param {string} value - The current value of the form field.
 * @param {Function} handleInputChange - Function to handle input changes.
 * @returns {JSX.Element|null} - The rendered form field component or null if hidden.
 */
function FormField({ detail, value, handleInputChange }) {
  // Skip rendering if the field is hidden or is a primary key.
  if (detail.hidden_flag === 'Yes' || detail.key_type === 'Primary') {
    return null;
  }

  // Determine the options source: lov_static or lov_sql (if available)
  const options = detail.lov_static ? parseLovStatic(detail.lov_static) : detail.lov_sql || [];

  // Determine the selected value, prioritize lov_sql_convert_in if available
  const selectedValue = detail.lov_sql_convert_in || value;

  return (
    <div key={detail.form_detail_id} style={{ marginBottom: '10px' }}>
      <label style={{ width: detail.column_width_caption || '150px', display: 'inline-block' }}>
        {detail.caption || detail.column_name}:
      </label>
      {options.length > 0 ? (
        <select
          name={detail.column_name}
          value={selectedValue}
          onChange={handleInputChange}
          required={detail.required_flag === 'Yes'}
          style={{ width: detail.column_width_data || '300px' }}
        >
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : detail.input_type === 'OLE' ? (
        <>
          <input
            type="file"
            name={detail.column_name}
            onChange={handleInputChange}
            required={detail.required_flag === 'Yes'}
            style={{ width: detail.column_width_data || '300px' }}
          />
          {value && !(value instanceof File) && (
            <span style={{ marginLeft: '10px' }}>
              Current file: {value}
            </span>
          )}
        </>
      ) : (
        <input
          type={detail.input_type.toLowerCase()}
          name={detail.column_name}
          value={selectedValue}
          onChange={handleInputChange}
          required={detail.required_flag === 'Yes'}
          placeholder={value}
          style={{ width: detail.column_width_data || '300px' }}
        />
      )}
    </div>
  );
}

export default FormField;