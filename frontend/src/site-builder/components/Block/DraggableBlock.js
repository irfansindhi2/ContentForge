import React, { useEffect, useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import Block from './Block';

const DraggableBlock = ({ block, setBlockDimensions, columns, rowHeight, containerRect }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
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

  // Apply positioning based on block's x and y
  const style = containerRect
    ? {
        position: 'absolute',
        left: `${(block.x / columns) * 100}%`,
        top: `${block.y * rowHeight}px`,
        width: `${(block.colSpan || 1) * (100 / columns)}%`,
        zIndex: isDragging ? 10 : 1,
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition: isDragging ? 'none' : 'transform 200ms ease',
      }
    : {};

  return (
    <div ref={combinedRef} style={style} {...attributes} {...listeners}>
      <Block block={block} />
    </div>
  );
};

export default DraggableBlock;