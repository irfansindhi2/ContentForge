import React, { useEffect, useRef } from 'react';
import Block from './Block';
import { gridToPixels } from '../../utils/gridUtils';

const BlockWrapper = ({ block, setBlockDimensions, columns, rowHeight, containerRect }) => {
    const blockRef = useRef(null);
  
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
          ...gridToPixels(block.x, block.y, containerRect, columns, rowHeight),
        }
      : {};
  
    return (
      <div ref={blockRef} style={style}>
        <Block block={block} />
      </div>
    );
  };

export default BlockWrapper;