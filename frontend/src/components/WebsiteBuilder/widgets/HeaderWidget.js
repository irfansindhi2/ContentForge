import React, { useState, useRef, useEffect } from 'react';
import './HeaderWidget.css';
import useFormPosition from './useFormPosition';
import { FaEdit, FaPalette, FaTrash, FaTimes } from 'react-icons/fa'; // Import icons

function HeaderWidget({
  id,
  content,
  onUpdate,
  onDelete,
  isEditing,
  setIsEditing,
  onContextMenu,
  draggedPosition,
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

  const handleChange = (field, value) => {
    onUpdate(id, { ...currentContent, [field]: value });
  };

  const handleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleIconClick = (formType) => {
    setIsEditing(true);
    setActiveForm(formType);
  };

  const closeForm = () => {
    setIsEditing(false);
    setActiveForm(null);
  };

  return (
    <div ref={widgetRef} className="header-widget">
      <div
        className="header-content"
        style={{
          backgroundColor: currentContent.backgroundColor,
          color: currentContent.textColor,
          textAlign: currentContent.alignment,
          fontSize: currentContent.fontSize, // Apply font size
        }}
        onClick={handleClick}
        onContextMenu={onContextMenu}
      >
        <h1>{currentContent.title}</h1>
        <p>{currentContent.subtitle}</p>
      </div>
      {isEditing && (
        <div
          ref={formRef}
          className="widget-edit-overlay active"
          style={{ transform: formTransform, top: formTop }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="widget-icons">
            <FaEdit onClick={() => handleIconClick('text')} />
            <FaPalette onClick={() => handleIconClick('color')} />
            <FaTrash onClick={() => onDelete(id)} />
            {activeForm && <FaTimes onClick={closeForm} />}
          </div>
          {activeForm && (
            <div className="widget-form active">
              <h2>Edit Header</h2>
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
              {activeForm === 'color' && (
                <div className="form-group">
                  <label htmlFor={`bgColor-${id}`}>Background Color</label>
                  <input
                    id={`bgColor-${id}`}
                    type="color"
                    value={currentContent.backgroundColor}
                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HeaderWidget;
