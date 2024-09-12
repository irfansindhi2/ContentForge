import React from 'react';
import { Resizable } from 'react-resizable';

function AdWidget({ id, content, onUpdate, onDelete }) {
  const defaultContent = {
    imageUrl: '',
    linkUrl: '',
    backgroundColor: '#ffffff',
  };

  const currentContent = { ...defaultContent, ...content };

  const handleChange = (field, value) => {
    onUpdate(id, { ...currentContent, [field]: value });
  };

  return (
    <Resizable
      width={200}
      height={200}
      onResize={(e, { size }) => {
        // Handle resize if needed
      }}
    >
      <div className="widget ad-widget">
        <h2>Ad</h2>
        <input
          type="text"
          value={currentContent.imageUrl}
          onChange={(e) => handleChange('imageUrl', e.target.value)}
          placeholder="Ad Image URL"
        />
        <input
          type="text"
          value={currentContent.linkUrl}
          onChange={(e) => handleChange('linkUrl', e.target.value)}
          placeholder="Ad Link URL"
        />
        <input
          type="color"
          value={currentContent.backgroundColor}
          onChange={(e) => handleChange('backgroundColor', e.target.value)}
        />
        <label>Background Color</label>
        <button onClick={() => onDelete(id)}>Delete</button>
        
        <div style={{
          backgroundColor: currentContent.backgroundColor,
          padding: '20px',
          marginTop: '10px'
        }}>
          <a href={currentContent.linkUrl} target="_blank" rel="noopener noreferrer">
            <img src={currentContent.imageUrl} alt="Advertisement" style={{ maxWidth: '100%' }} />
          </a>
        </div>
      </div>
    </Resizable>
  );
}

export default AdWidget;