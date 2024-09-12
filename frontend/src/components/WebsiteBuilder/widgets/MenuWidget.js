import React from 'react';
import { Resizable } from 'react-resizable';

function MenuWidget({ id, content, onUpdate, onDelete }) {
  const defaultContent = {
    menuItems: ['Home', 'About', 'Contact'],
    backgroundColor: '#f8f9fa',
    textColor: '#333333',
  };

  const currentContent = { ...defaultContent, ...content };

  const handleChange = (field, value) => {
    onUpdate(id, { ...currentContent, [field]: value });
  };

  const handleMenuItemChange = (e, index) => {
    const newItems = [...currentContent.menuItems];
    newItems[index] = e.target.value;
    handleChange('menuItems', newItems);
  };

  const addMenuItem = () => {
    handleChange('menuItems', [...currentContent.menuItems, '']);
  };

  return (
    <Resizable
      width={200}
      height={200}
      onResize={(e, { size }) => {
        // Handle resize if needed
      }}
    >
      <div className="widget menu-widget">
        <h2>Menu</h2>
        {currentContent.menuItems.map((item, i) => (
          <input
            key={i}
            type="text"
            value={item}
            onChange={(e) => handleMenuItemChange(e, i)}
            placeholder={`Menu Item ${i + 1}`}
          />
        ))}
        <button onClick={addMenuItem}>Add Menu Item</button>
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
        <button onClick={() => onDelete(id)}>Delete</button>
        
        <div style={{
          backgroundColor: currentContent.backgroundColor,
          color: currentContent.textColor,
          padding: '20px',
          marginTop: '10px'
        }}>
          <nav>
            {currentContent.menuItems.map((item, index) => (
              <a key={index} href="#" style={{ color: currentContent.textColor, marginRight: '10px' }}>{item}</a>
            ))}
          </nav>
        </div>
      </div>
    </Resizable>
  );
}

export default MenuWidget;