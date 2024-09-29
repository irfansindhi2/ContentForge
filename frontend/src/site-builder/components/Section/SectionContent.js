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

// Import the custom modifier
import { restrictHorizontalToParent } from '../../utils/modifiers';
import { snapToGrid } from '../../utils/modifiers'; // Import the snapToGrid modifier

const SectionContent = ({ blocks, updateBlocks }) => {
  const { previewMode } = useContext(PreviewModeContext);
  const [activeId, setActiveId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const gridSize = 50; // Define grid size (adjust as needed)

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
    return maxY + gridSize;
  }, [blocks, blockDimensions, gridSize]);

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

    // Apply snapping to delta values
    const snappedDeltaX = Math.round(delta.x / gridSize) * gridSize;
    const snappedDeltaY = Math.round(delta.y / gridSize) * gridSize;

    // Compute new x percentage
    const newPercentageX =
      blockToUpdate.x + (snappedDeltaX / containerWidth) * 100;

    // Clamp X values between 0% and 100%
    blockToUpdate.x = Math.max(0, Math.min(newPercentageX, 100));

    // Update y position in pixels
    blockToUpdate.y = (blockToUpdate.y || 0) + snappedDeltaY;

    updateBlocks(updatedBlocks);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full"
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
          modifiers={[restrictHorizontalToParent(containerRef), snapToGrid(gridSize)]}
        >
          {/* Conditionally render grid overlay when dragging */}
          {isDragging && (
            <div
              className="absolute inset-0 z-0 pointer-events-none"
              style={{
                backgroundSize: `${gridSize}px ${gridSize}px`,
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

          {/* Render DragOverlay with snapping */}
          <DragOverlay modifiers={[snapToGrid(gridSize)]}>
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