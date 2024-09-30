import React, { useRef, useEffect } from 'react';
import Block from './Block';

const BlockWrapper = React.memo(({ block, setBlockDimensions }) => {
  const blockRef = useRef(null);

  // Update block dimensions
  useEffect(() => {
    if (blockRef.current) {
      const rect = blockRef.current.getBoundingClientRect();
      setBlockDimensions(block.id, { width: rect.width, height: rect.height });
    }
  }, [block.id, setBlockDimensions]);

  return (
    <div ref={blockRef} className="block-wrapper">
      <Block block={block} />
    </div>
  );
});

export default BlockWrapper;