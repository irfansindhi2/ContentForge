import React from 'react';
import { useListLogic } from '../../hooks/useListLogic';

const SearchPage = () => {
  const {
    searchFields,
    searchConditions,
    handleSearchChange,
    handleSearchSubmit,
  } = useListLogic();

  return (
    <div>
      <h1>Search</h1>
      <form onSubmit={handleSearchSubmit} style={{ marginBottom: '20px', textAlign: 'center' }}>
        {searchFields.map((field, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <label>{field.caption || field.column_name}</label>
            <select
              name={`${field.column_name}-operator`}
              value={searchConditions[field.column_name]?.operator || '='}
              onChange={handleSearchChange}
              required
              style={{ marginLeft: '10px', marginRight: '10px' }}
            >
              <option value="=">Equals</option>
              <option value="LIKE">Contains</option>
              <option value=">=">Greater Than or Equals</option>
              <option value="<=">Less Than or Equals</option>
            </select>
            <input
              type="text"
              name={`${field.column_name}-value`}
              value={searchConditions[field.column_name]?.value || ''}
              onChange={handleSearchChange}
              placeholder={`Enter ${field.caption || field.column_name}`}
              style={{ width: '200px' }}
            />
          </div>
        ))}
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default SearchPage;
