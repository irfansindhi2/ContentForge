import React, { useState, useRef, useEffect } from 'react';
import './HeaderWidget.css'; // We'll create this file for custom styles

function HeaderWidget({ id, content, onUpdate, onDelete, isEditing, setIsEditing, onContextMenu, draggedPosition }) {
  const widgetRef = useRef(null);
  const formRef = useRef(null);
  const [formPosition, setFormPosition] = useState('bottom');

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

  function getTranslateValues(element) {
    const style = window.getComputedStyle(element);
    const transform = style.transform;
  
    if (!transform || transform === 'none') {
      return { x: 0, y: 0 };
    }
  
    let matrixValues;
  
    if (transform.startsWith('matrix3d(')) {
      // 3D matrix
      matrixValues = transform.match(/^matrix3d\((.+)\)$/)[1].split(', ');
      return {
        x: parseFloat(matrixValues[12]),
        y: parseFloat(matrixValues[13]),
      };
    } else if (transform.startsWith('matrix(')) {
      // 2D matrix
      matrixValues = transform.match(/^matrix\((.+)\)$/)[1].split(', ');
      return {
        x: parseFloat(matrixValues[4]),
        y: parseFloat(matrixValues[5]),
      };
    }
  
    return { x: 0, y: 0 };
  }
  
  const updateFormPosition = () => {
    if (formRef.current && widgetRef.current) {
      const widgetRect = widgetRef.current.getBoundingClientRect();
      const formRect = formRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  
      const spaceAbove = widgetRect.top;
      const spaceBelow = viewportHeight - widgetRect.bottom;
  
      // If the form is currently at the bottom
      if (formPosition === 'bottom') {
        // Only move it to top if there's not enough space below
        if (spaceBelow < formRect.height && spaceAbove >= formRect.height) {
          setFormPosition('top');
        }
      } else {
        // If the form is currently at the top
        // Only move it to bottom if there's not enough space above
        if (spaceAbove < formRect.height && spaceBelow >= formRect.height) {
          setFormPosition('bottom');
        }
      }
    }
  };
  
  

  useEffect(() => {
    if (isEditing) {
      const handleDrag = () => {
        updateFormPosition();
      };
      window.addEventListener('scroll', handleDrag);
      window.addEventListener('resize', handleDrag);
      window.addEventListener('mousemove', handleDrag);
      return () => {
        window.removeEventListener('scroll', handleDrag);
        window.removeEventListener('resize', handleDrag);
        window.removeEventListener('mousemove', handleDrag);
      };
    }
  }, [isEditing, formPosition]);
  

  useEffect(() => {
    if (draggedPosition && draggedPosition.id === id) {
      updateFormPosition();
    }
  }, [draggedPosition]);

  useEffect(() => {
    updateFormPosition();
  }, [content, isEditing]);

  useEffect(() => {
    if (isEditing) {
      const handleDrag = () => {
        requestAnimationFrame(updateFormPosition);
      };
      window.addEventListener('mousemove', handleDrag);
      return () => {
        window.removeEventListener('mousemove', handleDrag);
      };
    }
  }, [isEditing]);

  return (
    <div 
      ref={widgetRef} 
      className="header-widget"
    >
      <div 
        className="header-content"
        style={{ 
          backgroundColor: currentContent.backgroundColor,
          color: currentContent.textColor,
          textAlign: currentContent.alignment,
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
          className={`widget-edit-overlay ${formPosition}`}
          onClick={(e) => e.stopPropagation()}
        >
          <h2>Edit Header</h2>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={currentContent.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Header Title"
            />
          </div>
          <div className="form-group">
            <label htmlFor="subtitle">Subtitle</label>
            <input
              id="subtitle"
              type="text"
              value={currentContent.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              placeholder="Header Subtitle"
            />
          </div>
          <div className="form-group">
            <label htmlFor="bgColor">Background Color</label>
            <input
              id="bgColor"
              type="color"
              value={currentContent.backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="textColor">Text Color</label>
            <input
              id="textColor"
              type="color"
              value={currentContent.textColor}
              onChange={(e) => handleChange('textColor', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="alignment">Alignment</label>
            <select
              id="alignment"
              value={currentContent.alignment}
              onChange={(e) => handleChange('alignment', e.target.value)}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div className="form-actions">
            <button onClick={() => setIsEditing(false)}>Done</button>
            <button onClick={() => onDelete(id)}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HeaderWidget;