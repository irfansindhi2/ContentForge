import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Responsibilities() {
  const [responsibilities, setResponsibilities] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/responsibilities`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);  // Log the data to see what is being returned
        setResponsibilities(data);
      })
      .catch(error => console.error('Error fetching responsibilities:', error));
  }, []);

  return (
    <div>
      <h1>Responsibilities</h1>
      <ul>
        {Array.isArray(responsibilities) && responsibilities.map(resp => (
          <li key={resp.sys_responsibility_id}>
            <Link to={`/list/${resp.link}`}>{resp.name_display}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Responsibilities;
