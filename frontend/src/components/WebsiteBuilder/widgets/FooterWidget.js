import React, { useState, useRef, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import './FooterWidget.css';
import useFormPosition from './useFormPosition';

function FooterWidget({
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

  useEffect(() => {
    if (widgetRef.current) {
      const widgetHeight = widgetRef.current.offsetHeight; // Height in pixels
      const newH = Math.ceil(widgetHeight / rowHeight);
      onHeightChange(id, newH, newH);
    }
  }, [content, rowHeight]);

  const defaultContent = {
    copyright: '© 2023 Your Company Name. All rights reserved.',
    links: [
      { text: 'Home', url: '/' },
      { text: 'About', url: '/about' },
      { text: 'Contact', url: '/contact' },
    ],
    backgroundColor: '#333333',
    textColor: '#ffffff',
    fontSize: '14px',
  };

  const currentContent = { ...defaultContent, ...content };

  const formStyle = {
    fontSize: '14px', // Set a fixed font size for the form
  };

  const handleChange = (field, value) => {
    onUpdate(id, { ...currentContent, [field]: value });
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...currentContent.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    handleChange('links', newLinks);
  };

  const addLink = () => {
    handleChange('links', [...currentContent.links, { text: '', url: '' }]);
  };

  const removeLink = (index) => {
    const newLinks = currentContent.links.filter((_, i) => i !== index);
    handleChange('links', newLinks);
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
      className="footer-widget"
      style={{
        width: '100%', 
        height: '100%', 
        backgroundColor: currentContent.backgroundColor,
        color: currentContent.textColor,
        fontSize: currentContent.fontSize,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={handleClick}
      onContextMenu={onContextMenu}
    >
      <div className="footer-content">
        <div className="copyright">{currentContent.copyright}</div>
        <nav className="footer-links">
          {currentContent.links.map((link, index) => (
            <a key={index} href={link.url} className="footer-link">{link.text}</a>
          ))}
        </nav>
      </div>
      
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
                  <label htmlFor={`copyright-${id}`}>Copyright</label>
                  <input
                    id={`copyright-${id}`}
                    type="text"
                    value={currentContent.copyright}
                    onChange={(e) => handleChange('copyright', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Footer Links</label>
                  {currentContent.links.map((link, index) => (
                    <div key={index} className="link-input-group">
                      <input
                        type="text"
                        value={link.text}
                        onChange={(e) => handleLinkChange(index, 'text', e.target.value)}
                        placeholder="Link Text"
                      />
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                        placeholder="URL"
                      />
                      <button onClick={() => removeLink(index)}>Remove</button>
                    </div>
                  ))}
                  <button onClick={addLink}>Add Link</button>
                </div>
              </>
            )}
            {activeForm === 'style' && (
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
                <div className="form-group">
                  <label htmlFor={`fontSize-${id}`}>Font Size</label>
                  <input
                    id={`fontSize-${id}`}
                    type="text"
                    value={currentContent.fontSize}
                    onChange={(e) => handleChange('fontSize', e.target.value)}
                    placeholder="e.g., 14px, 1em, 1rem"
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

export default FooterWidget;