import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const GenericBlock = ({ id, index, content, onUpdate, onDelete, moveBlock }) => {
  const ref = useRef(null);

  const [{ handlerId }, drop] = useDrop({
    accept: 'BLOCK',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveBlock(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'BLOCK',
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1, marginBottom: '10px', padding: '10px', border: '1px solid #ccc' }}>
      <textarea
        value={content}
        onChange={(e) => onUpdate(id, e.target.value)}
        style={{ width: '100%', minHeight: '50px' }}
      />
      <button onClick={() => onDelete(id)}>Delete</button>
    </div>
  );
};

export default GenericBlock;