import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

function MenuWidget({ id, index, content, onUpdate, onDelete, moveWidget }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'WIDGET',
    item: { id, index, type: 'Menu' },
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

  const handleMenuItemChange = (e, index) => {
    const newItems = [...content.menuItems];
    newItems[index] = e.target.value;
    onUpdate(id, { ...content, menuItems: newItems });
  };

  const addMenuItem = () => {
    onUpdate(id, { ...content, menuItems: [...content.menuItems, ''] });
  };

  return (
    <div ref={(node) => drag(drop(node))} style={{ opacity: isDragging ? 0.5 : 1 }} className="widget menu-widget">
      <h2>Menu</h2>
      {content.menuItems && content.menuItems.map((item, i) => (
        <input
          key={i}
          type="text"
          value={item}
          onChange={(e) => handleMenuItemChange(e, i)}
          placeholder={`Menu Item ${i + 1}`}
        />
      ))}
      <button onClick={addMenuItem}>Add Menu Item</button>
      <button onClick={() => onDelete(id)}>Delete</button>
    </div>
  );
}

export default MenuWidget;