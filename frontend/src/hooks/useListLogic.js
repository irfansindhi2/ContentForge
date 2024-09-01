import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { fetchFormDetails, fetchListData, deleteListEntry, fetchListMetadata } from '../services/listService';
import sessionService from '../services/sessionService';

export const useListLogic = () => {
  const { listName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [tableData, setTableData] = useState([]);
  const [columnNames, setColumnNames] = useState([]);
  const [primaryKey, setPrimaryKey] = useState('');
  const [searchFields, setSearchFields] = useState([]);
  const [searchConditions, setSearchConditions] = useState(() => sessionService.getSearchConditions(listName) || {});
  const [loading, setLoading] = useState(true);
  const [listMetadata, setListMetadata] = useState(null);

  const fetchList = useCallback(async (conditions = {}) => {
    setLoading(true);
    try {
      const [listData, metadata] = await Promise.all([
        fetchListData(listName, conditions),
        fetchListMetadata(listName)
      ]);
      
      setListMetadata(metadata[0]); // Assuming the API returns an array with a single object

      const validColumns = metadata[0].ListDetails
        .filter(detail => detail.primary_flag !== "Yes")
        .map(detail => detail.column_name);

      setColumnNames(validColumns);

      const primaryKeyColumn = metadata[0].ListDetails.find(detail => detail.primary_flag === "Yes")?.column_name;
      setPrimaryKey(primaryKeyColumn || '');

      // Include the primary key in the table data
      const filteredData = listData.data.map(row => {
        const filteredRow = { [primaryKeyColumn]: row[primaryKeyColumn] };
        validColumns.forEach(col => {
          if (row.hasOwnProperty(col)) {
            filteredRow[col] = row[col];
          }
        });
        return filteredRow;
      });

      setTableData(filteredData);
    } catch (error) {
      console.error('Error fetching list data:', error);
    } finally {
      setLoading(false);
    }
  }, [listName]);

  useEffect(() => {
    if (location.pathname.includes('/search/')) {
      async function fetchFormMetadata() {
        try {
          const formData = await fetchFormDetails(listName);
          if (formData) {
            const searchableFields = formData.formDetails?.filter(detail => detail.search_flag === 'Yes') || [];
            setSearchFields(searchableFields);

            const initialSearchConditions = {};
            searchableFields.forEach(field => {
              initialSearchConditions[field.column_name] = { operator: '=', value: '' };
            });
            setSearchConditions(initialSearchConditions);
          }
        } catch (error) {
          console.error('Error fetching form metadata:', error);
        }
      }
      fetchFormMetadata();
    } else {
      if (location.state?.searchConditions) {
        fetchList(location.state.searchConditions);
      } else {
        fetchList();
      }
    }
  }, [listName, location, fetchList]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    const [column, type] = name.split('-');

    setSearchConditions((prevConditions) => ({
      ...prevConditions,
      [column]: {
        ...prevConditions[column],
        [type]: value,
      },
    }));
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    const filteredSearchConditions = Object.entries(searchConditions).reduce((acc, [column, condition]) => {
      const { operator, value } = condition || {};
      if (operator && value && value.trim() !== "") {
        acc[column] = { operator, value };
      }
      return acc;
    }, {});

    navigate(`/list/${listName}`, { state: { searchConditions: filteredSearchConditions } });
  };

  const handleEdit = useCallback((id) => {
    navigate(`/list/${listName}/${id}`);
  }, [navigate, listName]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        const result = await deleteListEntry(listName, id);
        if (result.status === 'success') {
          setTableData(prevData => prevData.filter(row => row[primaryKey] !== id));
        } else {
          console.error('Error deleting information:', result.message);
        }
      } catch (error) {
        console.error('Error deleting information:', error);
      }
    }
  };

  return {
    listName,
    tableData,
    columnNames,
    primaryKey,
    searchFields,
    searchConditions,
    handleSearchChange,
    handleSearchSubmit,
    handleDelete,
    handleEdit,
    loading,
    listMetadata,
  };
};