import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

function AdWidget({ id, index, content, onUpdate, onDelete, moveWidget }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'WIDGET',
    item: { id, index, type: 'Ad' },
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

  return (
    <div ref={(node) => drag(drop(node))} style={{ opacity: isDragging ? 0.5 : 1 }} className="widget ad-widget">
      <h2>Ad</h2>
      <input
        type="text"
        value={content.imageUrl || ''}
        onChange={(e) => onUpdate(id, { ...content, imageUrl: e.target.value })}
        placeholder="Ad Image URL"
      />
      <input
        type="text"
        value={content.linkUrl || ''}
        onChange={(e) => onUpdate(id, { ...content, linkUrl: e.target.value })}
        placeholder="Ad Link URL"
      />
      <button onClick={() => onDelete(id)}>Delete</button>
    </div>
  );
}

export default AdWidget;