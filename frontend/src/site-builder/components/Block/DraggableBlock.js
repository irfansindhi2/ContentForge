import React, { useEffect, useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import Block from './Block';

const DraggableBlock = ({ block, containerRef, setBlockDimensions }) => {
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableNodeRef,
    transform,
    transition,
    isDragging,
  } = useDraggable({
    id: block.id,
  });

  const blockRef = useRef(null);

  // Merge the refs
  const setNodeRef = (node) => {
    setDraggableNodeRef(node);
    blockRef.current = node;
  };

  useEffect(() => {
    if (blockRef.current) {
      const rect = blockRef.current.getBoundingClientRect();
      setBlockDimensions(block.id, { width: rect.width, height: rect.height });
    }
  }, [block.id, setBlockDimensions]);

  // Apply absolute positioning with dynamic coordinates
  const style = {
    position: 'absolute',
    left: `calc(${block.x}% + ${transform ? transform.x : 0}px)`,
    top: `${(block.y || 0) + (transform ? transform.y : 0)}px`,
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