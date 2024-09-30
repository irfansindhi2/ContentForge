import React, { useEffect, useRef, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import Block from './Block';

const DraggableBlock = ({ block, setBlockDimensions }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: block.id,
  });

  const blockRef = useRef(null);
  const [shouldTransition, setShouldTransition] = useState(false);

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

  useEffect(() => {
    if (!isDragging) {
      const timeoutId = setTimeout(() => setShouldTransition(true), 50);
      return () => clearTimeout(timeoutId);
    } else {
      setShouldTransition(false);
    }
  }, [isDragging]);

  const style = {
    zIndex: isDragging ? 10 : 1,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition: shouldTransition ? 'transform 200ms ease' : 'none',
  };

  return (
    <div ref={combinedRef} style={style} {...attributes} {...listeners}>
      <Block block={block} />
    </div>
  );
};

export default DraggableBlock;