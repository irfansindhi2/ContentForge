import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

function FooterWidget({ id, index, content, onUpdate, onDelete, moveWidget }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'WIDGET',
    item: { id, index, type: 'Footer' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'WIDGET',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveWidget(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const defaultContent = {
    copyright: '© 2023 Your Company Name. All rights reserved.',
    links: [
      { text: 'Home', url: '/' },
      { text: 'About', url: '/about' },
      { text: 'Contact', url: '/contact' },
    ],
    backgroundColor: '#333333',
    textColor: '#ffffff',
  };

  const currentContent = { ...defaultContent, ...content };

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

  return (
    <div ref={(node) => drag(drop(node))} style={{ opacity: isDragging ? 0.5 : 1 }} className="widget footer-widget">
      <h2>Footer</h2>
      <input
        type="text"
        value={currentContent.copyright}
        onChange={(e) => handleChange('copyright', e.target.value)}
        placeholder="Enter copyright text"
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
      
      <h3>Footer Links</h3>
      {currentContent.links.map((link, index) => (
        <div key={index}>
          <input
            type="text"
            value={link.text}
            onChange={(e) => handleLinkChange(index, 'text', e.target.value)}
            placeholder="Link text"
          />
          <input
            type="text"
            value={link.url}
            onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
            placeholder="Link URL"
          />
        </div>
      ))}
      <button onClick={addLink}>Add Link</button>
      <button onClick={() => onDelete(id)}>Delete</button>
      
      <div style={{
        backgroundColor: currentContent.backgroundColor,
        color: currentContent.textColor,
        padding: '20px',
        marginTop: '10px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p>{currentContent.copyright}</p>
          <nav>
            {currentContent.links.map((link, index) => (
              <a key={index} href={link.url} style={{ color: currentContent.textColor, marginLeft: '10px' }}>{link.text}</a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

export default FooterWidget;