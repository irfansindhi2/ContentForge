// ArticleWidget.js
import React, { useState, useRef } from 'react';
import './ArticleWidget.css';
import useFormPosition from './useFormPosition';

function ArticleWidget({
  id,
  content,
  onUpdate,
  onDelete,
  onContextMenu,
  draggedPosition,
  dragHandleProps,
}) {
  const widgetRef = useRef(null);
  const formRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeForm, setActiveForm] = useState(null);

  const { formTransform, formTop } = useFormPosition(widgetRef, formRef, isEditing, draggedPosition, id);

  const defaultContent = {
    title: 'Article Title',
    body: 'Article content goes here...',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    fontSize: '16px',
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
      setActiveForm((prevForm) => (prevForm === formType ? null : formType));
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
      className="article-widget"
      style={{ 
        backgroundColor: currentContent.backgroundColor,
        color: currentContent.textColor,
        fontSize: currentContent.fontSize,
        cursor: 'grab',
      }}
      onClick={handleClick}
      onContextMenu={onContextMenu}
    >
      <div className="drag-handle" {...dragHandleProps}>
        {/* You can use an icon or text as the drag handle */}
        <span style={{ cursor: 'grab' }}>⋮</span>
      </div>
      <h2>{currentContent.title}</h2>
      <p>{currentContent.body}</p>
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
              className={`tab ${activeForm === 'content' ? 'active' : ''}`}
              onClick={() => handleIconClick('content')}
            >
              Content
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
            {activeForm === 'content' && (
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
                  <label htmlFor={`body-${id}`}>Body</label>
                  <textarea
                    id={`body-${id}`}
                    value={currentContent.body}
                    onChange={(e) => handleChange('body', e.target.value)}
                  />
                </div>
              </>
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
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ArticleWidget;
