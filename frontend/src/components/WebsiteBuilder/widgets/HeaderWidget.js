import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

function HeaderWidget({ id, index, content, onUpdate, onDelete, moveWidget }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'WIDGET',
    item: { id, index, type: 'Header' },
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

  return (
    <div ref={(node) => drag(drop(node))} style={{ opacity: isDragging ? 0.5 : 1 }} className="widget header-widget">
      <h2>Header</h2>
      <input
        type="text"
        value={currentContent.title}
        onChange={(e) => handleChange('title', e.target.value)}
        placeholder="Enter header title"
      />
      <input
        type="text"
        value={currentContent.subtitle}
        onChange={(e) => handleChange('subtitle', e.target.value)}
        placeholder="Enter header subtitle"
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
      <label>Text Alignment</label>
      <button onClick={() => onDelete(id)}>Delete</button>
      
      <div style={{
        backgroundColor: currentContent.backgroundColor,
        color: currentContent.textColor,
        textAlign: currentContent.alignment,
        padding: '20px',
        marginTop: '10px'
      }}>
        <h1>{currentContent.title}</h1>
        <p>{currentContent.subtitle}</p>
      </div>
    </div>
  );
}

export default HeaderWidget;