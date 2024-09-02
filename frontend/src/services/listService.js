const API_URL = process.env.REACT_APP_API_URL;

export const fetchFormDetails = async (formName) => {
  const formDetailsUrl = `${API_URL}/api/form/${formName}`;
  const response = await fetch(formDetailsUrl, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch form details: ${response.statusText}`);
  }

  return response.json();
};

export const fetchListMetadata = async (listName) => {
  const listMetadataUrl = `${API_URL}/api/lists/${listName}`;
  const response = await fetch(listMetadataUrl, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch list metadata: ${response.statusText}`);
  }

  return response.json();
};

export const fetchListData = async (listName, searchConditions = {}, limit = 12, offset = 0) => {
  const filteredSearchConditions = Object.entries(searchConditions).reduce((acc, [column, condition]) => {
    const { operator, value } = condition || {};
    if (operator && value && value.trim() !== "") {
      acc[column] = { operator, value };
    }
    return acc;
  }, {});

  // const requestBody = {
  //   ...(Object.keys(filteredSearchConditions).length > 0 && { searchConditions: filteredSearchConditions }),
  //   ...(limit !== 12 && { limit }),
  //   ...(offset !== 0 && { offset }),
  // };

  const requestBody = {
    searchConditions: filteredSearchConditions,
    limit,  // Include limit in the request body
    offset, // Include offset in the request body
  };

  const response = await fetch(`${API_URL}/api/information/list/${listName}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch list data: ${response.statusText}`);
  }

  return response.json();
};

export const fetchSingleEntry = async (formName, id) => {
  const response = await fetch(`${API_URL}/api/information/${formName}/${id}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch entry: ${response.statusText}`);
  }

  return response.json();
};

export const deleteListEntry = async (listName, id) => {
  const deleteUrl = `${API_URL}/api/information/${listName}/${id}`;
  const response = await fetch(deleteUrl, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete list entry: ${response.statusText}`);
  }

  return response.json();
};