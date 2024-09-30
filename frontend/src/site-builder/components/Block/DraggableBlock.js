import React, { useEffect, useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import Block from './Block';

const DraggableBlock = ({ block, setBlockDimensions }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: block.id,
  });

  const blockRef = useRef(null);

  // Merge the refs
  const combinedRef = (node) => {
    setNodeRef(node);
    blockRef.current = node;
  };

  useEffect(() => {
    if (blockRef.current) {
      const rect = blockRef.current.getBoundingClientRect();
      setBlockDimensions(block.id, { width: rect.width, height: rect.height });
    }
  }, [block.id, setBlockDimensions]);

  // Apply absolute positioning based on block's x and y
  const style = {
    position: 'absolute',
    left: `${block.x * 4.16667}%`, // 4.16667% is the width of one column in a 24-column grid
    top: `${block.y * 50}px`,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={combinedRef} style={style} {...attributes} {...listeners}>
      <Block block={block} />
    </div>
  );
};

export default DraggableBlock;