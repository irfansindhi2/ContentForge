import React, { useEffect, useRef, useCallback } from 'react';
import { useDraggable } from '@dnd-kit/core';
import Block from './Block';

const DraggableBlock = React.memo(({ block, setBlockDimensions }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: block.id,
  });

  const blockRef = useRef(null);

  // Update dimensions when the block mounts or when its dimensions change
  useEffect(() => {
    if (blockRef.current) {
      const rect = blockRef.current.getBoundingClientRect();
      setBlockDimensions(block.id, { width: rect.width, height: rect.height });
    }
  }, [block.id, setBlockDimensions]);

  // Inline styles for positioning and transition
  const style = {
    zIndex: isDragging ? 10 : 1,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition: !isDragging ? 'transform 200ms ease' : 'none',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Block block={block} />
    </div>
  );
});

export default DraggableBlock;