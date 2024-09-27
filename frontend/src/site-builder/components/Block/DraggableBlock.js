import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import Block from '../Block/Block';

const DraggableBlock = ({ block }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useDraggable({
    id: block.id,
  });

  // Apply absolute positioning with dynamic coordinates
  const style = {
    position: 'absolute',
    left: block.x + (transform ? transform.x : 0),
    top: block.y + (transform ? transform.y : 0),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Block block={block} />
    </div>
  );
};

export default DraggableBlock;
