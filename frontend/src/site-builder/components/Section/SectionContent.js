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
import { restrictMovement } from '../../utils/modifiers';

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
        let y = block.y || 0; // y position in pixels

        maxY = Math.max(maxY, y + blockHeight);
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
    const containerWidth = containerRect.width;
  
    // Compute new x percentage based on 24-column grid without hardcoding grid size
    const newPercentageX = ((blockToUpdate.x * containerWidth) / 100 + delta.x) / containerWidth * 100;
  
    // Clamp X values between 0% and 100% of the container
    blockToUpdate.x = Math.max(0, Math.min(newPercentageX, 100));
  
    // Update y position in pixels
    blockToUpdate.y = (blockToUpdate.y || 0) + delta.y;
  
    updateBlocks(updatedBlocks);
  };

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-24 md:grid-cols-12 sm:grid-cols-6"
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
          modifiers={[restrictMovement(containerRef)]}
        >
          {/* Conditionally render grid overlay when dragging */}
          {isDragging && (
            <div
              className="absolute inset-0 z-0 pointer-events-none"
              style={{
                backgroundSize: '4.16667% 50px', // 4.16667% width represents one column in a 24-column grid
                backgroundImage:
                  'linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)',
              }}
            />
          )}

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