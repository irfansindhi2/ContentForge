import React, { useEffect, useRef } from 'react';
import Block from './Block';

const BlockWrapper = ({ block, setBlockDimensions }) => {
  const blockRef = useRef(null);

  useEffect(() => {
    if (blockRef.current) {
      const rect = blockRef.current.getBoundingClientRect();
      setBlockDimensions(block.id, { width: rect.width, height: rect.height });
    }
  }, [block.id, setBlockDimensions]);

  return (
    <div
      ref={blockRef}
      style={{
        position: 'absolute',
        left: `${block.x}%`,
        top: `${block.y || 0}px`,
      }}
    >
      <Block block={block} />
    </div>
  );
};

export default BlockWrapper;