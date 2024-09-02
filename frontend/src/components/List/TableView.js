import React from 'react';

function TableView({ listName, columnNames, tableData, primaryKey, handleDelete, handleEdit, handleSort, sortConfig, listMetadata }) {
  const getColumnHeading = (columnName) => {
    const detail = listMetadata?.ListDetails.find(d => d.column_name === columnName);
    return detail ? detail.column_heading : columnName;
  };

  const getSortIcon = (columnName) => {
    if (!sortConfig) return null;
    if (sortConfig.key === columnName) {
      if (sortConfig.direction === 'asc') return '↑';
      if (sortConfig.direction === 'desc') return '↓';
    }
    return null;
  };

  return (
    <table className="styled-table">
      <thead>
        <tr>
          {columnNames.map((colName, index) => (
            <th key={index}>
              {getColumnHeading(colName)}
              <button onClick={() => handleSort(colName, 'asc')}>↑</button>
              <button onClick={() => handleSort(colName, 'desc')}>↓</button>
              {getSortIcon(colName)}
            </th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tableData.length > 0 ? (
          tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columnNames.map((colName, colIndex) => (
                <td key={colIndex}>{row[colName]}</td>
              ))}
              <td>
                <button onClick={() => handleDelete(row[primaryKey])}>Delete</button>
                <button onClick={() => handleEdit(row[primaryKey])}>Edit</button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columnNames.length + 1}>No data available</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default TableView;
