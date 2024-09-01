import React from 'react';
import { Link } from 'react-router-dom';

function TableView({ listName, columnNames, tableData, primaryKey, handleDelete, listMetadata }) {
  const getColumnHeading = (columnName) => {
    const detail = listMetadata?.ListDetails.find(d => d.column_name === columnName);
    return detail ? detail.column_heading : columnName;
  };

  return (
    <table className="styled-table">
      <thead>
        <tr>
          {columnNames.map((colName, index) => (
            <th key={index}>{getColumnHeading(colName)}</th>
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
                <Link to={`/form/${listName}?id=${row[primaryKey]}`}>Edit</Link>
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