import React, { useContext, useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  DndContext,
  useSensor,
  useSensors,
  TouchSensor,
  MouseSensor,
  closestCenter,
  DragOverlay,
} from '@dnd-kit/core';
import { PreviewModeContext } from '../../PreviewModeContext';
import DraggableBlock from '../Block/DraggableBlock';
import BlockWrapper from '../Block/BlockWrapper';
import Block from '../Block/Block';
import { restrictToGrid } from '../../utils/modifiers';

const SectionContent = ({ blocks, updateBlocks }) => {
  const { previewMode } = useContext(PreviewModeContext);
  const [activeId, setActiveId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  // State to hold dimensions of blocks
  const [blockDimensions, setBlockDimensions] = useState({});

  // Memoize the handleSetBlockDimensions function to prevent infinite loops
  const handleSetBlockDimensions = useCallback((blockId, dimensions) => {
    setBlockDimensions((prevDimensions) => ({
      ...prevDimensions,
      [blockId]: dimensions,
    }));
  }, []);

  // Compute container height based on blocks' positions and dimensions
  const containerHeight = useMemo(() => {
    let maxY = 0;

    blocks.forEach((block) => {
      const dimensions = blockDimensions[block.id];
      if (dimensions) {
        const blockHeight = dimensions.height;
        let y = block.y || 0; // y position in grid units

        maxY = Math.max(maxY, (y + 1) * 50); // Assuming each grid cell is 50px high
      }
    });

    // Add some padding if needed
    return maxY + 50; // You may adjust this padding as necessary
  }, [blocks, blockDimensions]);

  // Define sensors for touch and mouse support
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
    setIsDragging(true);
  };

  const handleDragEnd = ({ active, delta }) => {
    setActiveId(null);
    setIsDragging(false);
  
    const blockIndex = blocks.findIndex((block) => block.id === active.id);
    if (blockIndex === -1) return;
  
    const updatedBlocks = [...blocks];
    const blockToUpdate = updatedBlocks[blockIndex];
  
    const containerRect = containerRef.current.getBoundingClientRect();
    const cellWidth = containerRect.width / 24; // 24 columns
    const cellHeight = 50; // Assuming each grid cell is 50px high
  
    // Compute new x and y in grid units
    const newX = Math.round((blockToUpdate.x + delta.x / cellWidth));
    const newY = Math.round((blockToUpdate.y + delta.y / cellHeight));
  
    // Clamp X values between 0 and 23 (24 columns)
    blockToUpdate.x = Math.max(0, Math.min(newX, 23));
    
    // Clamp Y values to be non-negative
    blockToUpdate.y = Math.max(0, newY);
  
    updateBlocks(updatedBlocks);
  };

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-24 gap-0"
      style={{ height: `${containerHeight}px`, overflow: 'visible' }}
    >
      {previewMode ? (
        // In preview mode, render blocks without drag-and-drop
        blocks.map((block) => (
          <BlockWrapper
            key={block.id}
            block={block}
            setBlockDimensions={handleSetBlockDimensions}
          />
        ))
      ) : (
        // In edit mode, enable drag-and-drop functionality
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToGrid]}
        >
          {/* Render grid overlay */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundSize: '4.16667% 50px', // 4.16667% width represents one column in a 24-column grid
              backgroundImage:
                'linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)',
            }}
          />

          {/* Render draggable blocks */}
          {blocks.map((block) => (
            <DraggableBlock
              key={block.id}
              block={block}
              setBlockDimensions={handleSetBlockDimensions}
            />
          ))}

          {/* Render DragOverlay */}
          <DragOverlay>
            {activeId ? (
              <Block block={blocks.find((block) => block.id === activeId)} />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
};

export default SectionContent;