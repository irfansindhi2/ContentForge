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
  } = useListLogic();

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
        <TableView
          listName={listName}
          columnNames={columnNames}
          tableData={tableData}
          primaryKey={primaryKey}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          listMetadata={listMetadata}
        />
      )}
    </div>
  );
}

export default List;