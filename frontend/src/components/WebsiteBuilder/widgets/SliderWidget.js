import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

function SliderWidget({ id, index, content, onUpdate, onDelete, moveWidget }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'WIDGET',
    item: { id, index, type: 'Slider' },
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

  const handleImageUrlChange = (e, index) => {
    const newUrls = [...content.imageUrls];
    newUrls[index] = e.target.value;
    onUpdate(id, { ...content, imageUrls: newUrls });
  };

  const addImageUrl = () => {
    onUpdate(id, { ...content, imageUrls: [...content.imageUrls, ''] });
  };

  return (
    <div ref={(node) => drag(drop(node))} style={{ opacity: isDragging ? 0.5 : 1 }} className="widget slider-widget">
      <h2>Slider</h2>
      {content.imageUrls && content.imageUrls.map((url, i) => (
        <input
          key={i}
          type="text"
          value={url}
          onChange={(e) => handleImageUrlChange(e, i)}
          placeholder={`Image URL ${i + 1}`}
        />
      ))}
      <button onClick={addImageUrl}>Add Image</button>
      <button onClick={() => onDelete(id)}>Delete</button>
    </div>
  );
}

export default SliderWidget;