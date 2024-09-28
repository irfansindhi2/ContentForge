// SectionContent.jsx
import React, { useContext, useState, useRef, useEffect, useMemo } from 'react';
import {
  DndContext,
  useSensor,
  useSensors,
  TouchSensor,
  MouseSensor,
} from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { snapToGrid } from '../../utils/modifiers';
import { PreviewModeContext } from '../../PreviewModeContext';
import DraggableBlock from '../Block/DraggableBlock';
import BlockWrapper from '../Block/BlockWrapper'; // New component
import Block from '../Block/Block';

const SectionContent = ({ blocks, updateBlocks }) => {
  const { previewMode } = useContext(PreviewModeContext);
  const [isDragging, setIsDragging] = useState(false);
  const [scrollYStart, setScrollYStart] = useState(0);
  const containerRef = useRef(null);
  const [blockDimensions, setBlockDimensions] = useState({});
  const [gridSize, setGridSize] = useState(50); // Default grid size
  const [draggingBlock, setDraggingBlock] = useState(null);

  // Update grid size based on container width
  useEffect(() => {
    const updateGridSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.getBoundingClientRect().width;
        setGridSize(containerWidth / 24); // Divide container into 24 columns
      }
    };
    updateGridSize();
    window.addEventListener('resize', updateGridSize);
    return () => window.removeEventListener('resize', updateGridSize);
  }, []);

  // Define sensors for touch and mouse support
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragStart = ({ active }) => {
    setIsDragging(true);
    setScrollYStart(window.scrollY);
    setDraggingBlock({ id: active.id, x: null, y: null });
  };

  const handleDragMove = ({ active, delta }) => {
    const blockIndex = blocks.findIndex((block) => block.id === active.id);
    if (blockIndex === -1) return;

    const block = blocks[blockIndex];

    // Get container dimensions
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;

    // Adjust delta.y by subtracting the scroll difference
    const scrollYEnd = window.scrollY;
    const scrollDeltaY = scrollYEnd - scrollYStart;

    const deltaX = delta.x;
    const deltaY = delta.y - scrollDeltaY;

    // Compute new x percentage
    const newPercentageX = block.x + (deltaX / containerWidth) * 100;

    // Clamp X values between 0% and 100%
    const clampedX = Math.max(0, Math.min(newPercentageX, 100));

    // Compute potential new y position
    const newY = (block.y || 0) + deltaY;

    setDraggingBlock({ id: active.id, x: clampedX, y: newY });
  };

  const handleDragEnd = ({ active, delta }) => {
    setIsDragging(false);
    setDraggingBlock(null);

    const blockIndex = blocks.findIndex((block) => block.id === active.id);
    if (blockIndex === -1) return;

    const updatedBlocks = [...blocks];
    const blockToUpdate = updatedBlocks[blockIndex];

    // Get container dimensions
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;

    // Adjust delta.y by subtracting the scroll difference
    const scrollYEnd = window.scrollY;
    const scrollDeltaY = scrollYEnd - scrollYStart;

    const deltaX = delta.x;
    const deltaY = delta.y - scrollDeltaY;

    // Compute new x percentage
    const newPercentageX = blockToUpdate.x + (deltaX / containerWidth) * 100;

    // Clamp X values between 0% and 100%
    blockToUpdate.x = Math.max(0, Math.min(newPercentageX, 100));

    // Update y position in pixels
    blockToUpdate.y = (blockToUpdate.y || 0) + deltaY;

    updateBlocks(updatedBlocks);
  };

  // Function to update block dimensions
  const handleSetBlockDimensions = (blockId, dimensions) => {
    setBlockDimensions((prevDimensions) => ({
      ...prevDimensions,
      [blockId]: dimensions,
    }));
  };

  // Compute container height based on blocks' positions and dimensions
  const containerHeight = useMemo(() => {
    let maxY = 0;

    blocks.forEach((block) => {
      const dimensions = blockDimensions[block.id];
      if (dimensions) {
        const blockHeight = dimensions.height;
        let y = block.y || 0; // y position in pixels

        // If this is the currently dragging block, use its potential position
        if (draggingBlock && block.id === draggingBlock.id && draggingBlock.y !== null) {
          y = draggingBlock.y;
        }

        maxY = Math.max(maxY, y + blockHeight);
      }
    });

    // Add some padding if needed
    return maxY + gridSize;
  }, [blocks, blockDimensions, gridSize, draggingBlock]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: `${containerHeight}px`, overflow: 'visible' }}
    >
      {previewMode ? (
        // In preview mode, render blocks with BlockWrapper to get dimensions
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
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToParentElement, snapToGrid(gridSize)]}
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
              containerRef={containerRef}
              setBlockDimensions={handleSetBlockDimensions}
            />
          ))}
        </DndContext>
      )}
    </div>
  );
};

export default SectionContent;