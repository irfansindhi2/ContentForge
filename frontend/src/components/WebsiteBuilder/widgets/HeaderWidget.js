import React, { useState, useRef, useEffect } from 'react';
import './HeaderWidget.css';
import useFormPosition from './useFormPosition';

function HeaderWidget({
  id,
  content,
  onUpdate,
  onDelete,
  isEditing,
  setIsEditing,
  onContextMenu,
  onHeightChange,
  draggedPosition,
  rowHeight
}) {
  const widgetRef = useRef(null);
  const formRef = useRef(null);
  const [activeForm, setActiveForm] = useState(null);

  // Use the custom hook
  const { formTransform, formTop } = useFormPosition(widgetRef, formRef, isEditing, draggedPosition, id);

  const defaultContent = {
    title: 'Welcome to Our Website',
    subtitle: 'Discover amazing content',
    backgroundColor: '#f8f9fa',
    textColor: '#333333',
    alignment: 'center',
    fontSize: '16px', // Add default font size
  };

  const currentContent = { ...defaultContent, ...content };

  const formStyle = {
    fontSize: '14px', // Set a fixed font size for the form
  };

  const handleChange = (field, value) => {
    onUpdate(id, { ...currentContent, [field]: value });
  };

  const handleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleIconClick = (formType) => {
    if (formType === 'delete') {
      onDelete(id);
    } else {
      setIsEditing(true);
      setActiveForm(prevForm => prevForm === formType ? null : formType);
    }
  };

  const closeForm = () => {
    setIsEditing(false);
    setActiveForm(null);
  };

  const handleFormClick = (e) => {
    e.stopPropagation();
    if (e.target === e.currentTarget) {
      closeForm();
    }
  };

  useEffect(() => {
    if (widgetRef.current) {
      const widgetHeight = widgetRef.current.offsetHeight; // Height in pixels
      const newH = Math.ceil(widgetHeight / rowHeight);
      onHeightChange(id, newH);
    }
  }, [content, rowHeight]);
  

  return (
    <div 
      ref={widgetRef} 
      className="header-widget"
      style={{ 
        width: '100%', 
        height: '100%', 
        backgroundColor: currentContent.backgroundColor,
        color: currentContent.textColor,
        textAlign: currentContent.alignment,
        fontSize: currentContent.fontSize,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={handleClick}
      onContextMenu={onContextMenu}
    >
      <h1>{currentContent.title}</h1>
      <p>{currentContent.subtitle}</p>
      {isEditing && (
        <div 
          ref={formRef}
          className={`widget-edit-overlay ${isEditing ? 'active' : ''}`}
          style={{
            transform: formTransform,
            top: formTop,
            ...formStyle, // Apply the form style here
          }}
          onClick={handleFormClick}
        >
          <div className="widget-tabs">
            <span 
              className={`tab ${activeForm === 'text' ? 'active' : ''}`}
              onClick={() => handleIconClick('text')}
            >
              Font
            </span>
            <span 
              className={`tab ${activeForm === 'color' ? 'active' : ''}`}
              onClick={() => handleIconClick('color')}
            >
              Background
            </span>
            <span 
              className="tab delete-tab"
              onClick={() => handleIconClick('delete')}
            >
              Delete
            </span>
          </div>
          <div className={`widget-form ${activeForm ? 'active' : ''}`} style={formStyle}>
            {activeForm === 'text' && (
              <>
                <div className="form-group">
                  <label htmlFor={`title-${id}`}>Title</label>
                  <input
                    id={`title-${id}`}
                    type="text"
                    value={currentContent.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`subtitle-${id}`}>Subtitle</label>
                  <input
                    id={`subtitle-${id}`}
                    type="text"
                    value={currentContent.subtitle}
                    onChange={(e) => handleChange('subtitle', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`fontSize-${id}`}>Font Size</label>
                  <input
                    id={`fontSize-${id}`}
                    type="text"
                    value={currentContent.fontSize}
                    onChange={(e) => handleChange('fontSize', e.target.value)}
                    placeholder="e.g., 16px, 1.2em, 1.5rem"
                  />
                </div>
              </>
            )}
            {activeForm === 'color' && (
              <>
                <div className="form-group">
                  <label htmlFor={`bgColor-${id}`}>Background Color</label>
                  <input
                    id={`bgColor-${id}`}
                    type="color"
                    value={currentContent.backgroundColor}
                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`textColor-${id}`}>Text Color</label>
                  <input
                    id={`textColor-${id}`}
                    type="color"
                    value={currentContent.textColor}
                    onChange={(e) => handleChange('textColor', e.target.value)}
                  />
                </div>
              </>
            )}
            {activeForm === 'layout' && (
              <div className="form-group">
                <label htmlFor={`alignment-${id}`}>Text Alignment</label>
                <select
                  id={`alignment-${id}`}
                  value={currentContent.alignment}
                  onChange={(e) => handleChange('alignment', e.target.value)}
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HeaderWidget;
