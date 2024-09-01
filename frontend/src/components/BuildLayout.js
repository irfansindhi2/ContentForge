import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BuildLayout = () => {
  const { id } = useParams();  // Get the `id` from the URL params
  const [layoutData, setLayoutData] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get(`${process.env.REACT_APP_API_URL}/api/information/${id}`, { withCredentials: true })
        .then(response => setLayoutData(response.data))
        .catch(error => console.error('Error fetching layout data:', error));
    }
  }, [id]);

  const generateHtmlContent = () => {
    if (!layoutData) return '';

    return `
      <html>
        <head>
          <title>${layoutData.site_title}</title>
        </head>
        <body>
          <h1>${layoutData.heading}</h1>
          <div>
            ${layoutData.body}
          </div>
        </body>
      </html>
    `;
  };

  const downloadHtmlFile = () => {
    const htmlContent = generateHtmlContent();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${layoutData.unique_file || `layout-${id}`}.html`;
    link.click();
  };

  return (
    <div>
      <h1>Build Layout</h1>
      {layoutData ? (
        <div>
          <button onClick={downloadHtmlFile}>Download as HTML</button>
          <div dangerouslySetInnerHTML={{ __html: layoutData.body }} />
        </div>
      ) : (
        <p>Loading layout data...</p>
      )}
    </div>
  );
};

export default BuildLayout;
