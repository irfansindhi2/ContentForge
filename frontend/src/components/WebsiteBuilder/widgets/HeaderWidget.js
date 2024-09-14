import React, { useState, useRef, useEffect } from 'react';
import './HeaderWidget.css';

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
  const [formTransform, setFormTransform] = useState('translateY(0)');
  const [formTop, setFormTop] = useState('100%'); // Default to below
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formPosition, setFormPosition] = useState('below'); // 'above' or 'below'

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

  const updateFormPosition = () => {
    if (formRef.current && widgetRef.current) {
      const widgetRect = widgetRef.current.getBoundingClientRect();
      const formHeight = formRef.current.offsetHeight;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      const spaceAbove = widgetRect.top;
      const spaceBelow = viewportHeight - widgetRect.bottom;

      const buffer = 20; // pixels, to prevent frequent flipping

      // Decide whether to position form above or below, change only if necessary
      if (formPosition === 'below') {
        if (spaceBelow < formHeight + buffer && spaceAbove >= formHeight + buffer) {
          // Switch to above
          setFormPosition('above');
          setFormTop('0');
          setFormTransform('translateY(-100%)');
        }
      } else if (formPosition === 'above') {
        if (spaceAbove < formHeight + buffer && spaceBelow >= formHeight + buffer) {
          // Switch to below
          setFormPosition('below');
          setFormTop('100%');
          setFormTransform('translateY(0)');
        }
      } else {
        // Initial positioning
        if (spaceBelow >= formHeight + buffer) {
          setFormPosition('below');
          setFormTop('100%');
          setFormTransform('translateY(0)');
        } else if (spaceAbove >= formHeight + buffer) {
          setFormPosition('above');
          setFormTop('0');
          setFormTransform('translateY(-100%)');
        } else {
          // Default to below
          setFormPosition('below');
          setFormTop('100%');
          setFormTransform('translateY(0)');
        }
      }
    }
  };

  useEffect(() => {
    if (isEditing) {
      updateFormPosition();

      const handleWindowResize = () => {
        updateFormPosition();
      };

      window.addEventListener('resize', handleWindowResize);

      return () => {
        window.removeEventListener('resize', handleWindowResize);
      };
    }
  }, [isEditing]);

  useEffect(() => {
    if (draggedPosition && draggedPosition.id === id) {
      updateFormPosition();
    }
  }, [draggedPosition]);

  useEffect(() => {
    if (isEditing) {
      setIsFormVisible(true);
    } else {
      const timer = setTimeout(() => setIsFormVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isEditing]);

  return (
    <div ref={widgetRef} className="header-widget">
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
      {isFormVisible && (
        <div
          ref={formRef}
          className={`widget-edit-overlay ${isEditing ? 'active' : ''}`}
          style={{ transform: formTransform, top: formTop }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2>Edit Header</h2>
          {/* Form fields */}
          <div className="form-group">
            <label htmlFor={`title-${id}`}>Title</label>
            <input
              id={`title-${id}`}
              type="text"
              value={currentContent.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Header Title"
            />
          </div>
          {/* Additional form fields */}
          <div className="form-group">
            <label htmlFor={`subtitle-${id}`}>Subtitle</label>
            <input
              id={`subtitle-${id}`}
              type="text"
              value={currentContent.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              placeholder="Header Subtitle"
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
            <label htmlFor={`alignment-${id}`}>Alignment</label>
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
          {/* Form actions */}
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
