import React, { useState, useRef } from 'react';
import './TextWidget.css';
import useFormPosition from './useFormPosition';

function TextWidget({
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

  const { formTransform, formTop } = useFormPosition(widgetRef, formRef, isEditing, draggedPosition, id);

  const defaultContent = {
    text: 'Enter your text here',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    fontSize: '16px',
    horizontalAlignment: 'left',
    verticalAlignment: 'middle',
  };

  const currentContent = { ...defaultContent, ...content };

  const formStyle = {
    fontSize: '14px',
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

  return (
    <div 
      ref={widgetRef} 
      className="text-widget"
      style={{ 
        width: '100%', 
        height: '100%', 
        backgroundColor: currentContent.backgroundColor,
        color: currentContent.textColor,
        fontSize: currentContent.fontSize,
        display: 'flex',
        justifyContent: currentContent.horizontalAlignment,
        alignItems: currentContent.verticalAlignment,
      }}
      onClick={handleClick}
      onContextMenu={onContextMenu}
    >
      <p style={{ textAlign: currentContent.horizontalAlignment, width: '100%' }}>{currentContent.text}</p>
      {isEditing && (
        <div 
          ref={formRef}
          className={`widget-edit-overlay ${isEditing ? 'active' : ''}`}
          style={{
            transform: formTransform,
            top: formTop,
            ...formStyle,
          }}
          onClick={handleFormClick}
        >
          <div className="widget-tabs">
            <span 
              className={`tab ${activeForm === 'text' ? 'active' : ''}`}
              onClick={() => handleIconClick('text')}
            >
              Text
            </span>
            <span 
              className={`tab ${activeForm === 'style' ? 'active' : ''}`}
              onClick={() => handleIconClick('style')}
            >
              Style
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
              <div className="form-group">
                <label htmlFor={`text-${id}`}>Text</label>
                <textarea
                  id={`text-${id}`}
                  value={currentContent.text}
                  onChange={(e) => handleChange('text', e.target.value)}
                />
              </div>
            )}
            {activeForm === 'style' && (
              <>
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
                <div className="form-group">
                  <label htmlFor={`horizontalAlignment-${id}`}>Horizontal Alignment</label>
                  <select
                    id={`horizontalAlignment-${id}`}
                    value={currentContent.horizontalAlignment}
                    onChange={(e) => handleChange('horizontalAlignment', e.target.value)}
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor={`verticalAlignment-${id}`}>Vertical Alignment</label>
                  <select
                    id={`verticalAlignment-${id}`}
                    value={currentContent.verticalAlignment}
                    onChange={(e) => handleChange('verticalAlignment', e.target.value)}
                  >
                    <option value="flex-start">Top</option>
                    <option value="center">Middle</option>
                    <option value="flex-end">Bottom</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TextWidget;
