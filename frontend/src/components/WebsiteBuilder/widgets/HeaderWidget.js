import React from 'react';

function HeaderWidget({ id, content, onUpdate, onDelete, isEditing, setIsEditing, onContextMenu }) {
  const defaultContent = {
    title: 'Welcome to Our Website',
    subtitle: 'Discover amazing content',
    backgroundColor: '#f8f9fa',
    textColor: '#333333',
    alignment: 'center',
  };

  const currentContent = { ...defaultContent, ...content };

  const handleChange = (field, value) => {
    onUpdate(id, { ...currentContent, [field]: value });
  };

  const handleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div 
        style={{ 
          width: '100%',
          height: '100%',
          backgroundColor: currentContent.backgroundColor,
          color: currentContent.textColor,
          textAlign: currentContent.alignment,
          padding: '20px',
          cursor: 'move',
        }}
        onClick={handleClick}
        onContextMenu={onContextMenu}
      >
        <h1>{currentContent.title}</h1>
        <p>{currentContent.subtitle}</p>
      </div>
      {isEditing && (
        <div className="widget-edit-overlay" style={{
          position: 'absolute',
          top: '-100%',
          left: '0',
          right: '0',
          backgroundColor: 'white',
          padding: '10px',
          zIndex: 1000,
          border: '1px solid #ccc',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}>
          <h2>Edit Header</h2>
          <input
            type="text"
            value={currentContent.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Header Title"
          />
          <input
            type="text"
            value={currentContent.subtitle}
            onChange={(e) => handleChange('subtitle', e.target.value)}
            placeholder="Header Subtitle"
          />
          <input
            type="color"
            value={currentContent.backgroundColor}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
          />
          <label>Background Color</label>
          <input
            type="color"
            value={currentContent.textColor}
            onChange={(e) => handleChange('textColor', e.target.value)}
          />
          <label>Text Color</label>
          <select
            value={currentContent.alignment}
            onChange={(e) => handleChange('alignment', e.target.value)}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
          <button onClick={() => setIsEditing(false)}>Done</button>
          <button onClick={() => onDelete(id)}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default HeaderWidget;