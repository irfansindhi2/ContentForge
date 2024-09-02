import React from 'react';
import { Link } from 'react-router-dom';
import { useListLogic } from '../../hooks/useListLogic';
import './List.css';
import TableView from './TableView';

function List() {
  const {
    listName,
    tableData,
    columnNames,
    primaryKey,
    handleDelete,
    handleEdit,
    loading,
    listMetadata,
    handlePageChange,
    totalRecords, // Use totalRecords from useListLogic
    limit,
    offset,
    handleSort,
    sortConfig
  } = useListLogic();

  // Calculate the current page and total pages
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = totalRecords > 0 ? Math.ceil(totalRecords / limit) : 1;

  return (
    <div>
      <h1>List of {listMetadata?.name || ''}</h1>
      
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Link to={`/form/${listName}`}>New Entry</Link>
        <Link to={`/search/${listName}`} style={{ marginLeft: '10px' }}>Search</Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <TableView
            listName={listName}
            columnNames={columnNames}
            tableData={tableData}
            primaryKey={primaryKey}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            handleSort={handleSort}
            listMetadata={listMetadata}
            sortConfig={sortConfig}
          />
          <div className="pagination">
            {currentPage > 1 && (
              <button onClick={() => handlePageChange(offset - limit)}>Previous</button>
            )}
            <span>
              Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages && (
              <button onClick={() => handlePageChange(offset + limit)}>Next</button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default List;
