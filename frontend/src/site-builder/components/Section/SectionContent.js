import React, { useContext, useState, useRef, useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { snapToGrid } from '../../utils/modifiers';
import { PreviewModeContext } from '../../PreviewModeContext';
import DraggableBlock from '../Block/DraggableBlock';
import Block from '../Block/Block';

const SectionContent = ({ blocks, updateBlocks }) => {
  const { previewMode } = useContext(PreviewModeContext);
  const [isDragging, setIsDragging] = useState(false);
  const [scrollYStart, setScrollYStart] = useState(0);
  const containerRef = useRef(null);
  const [gridSize, setGridSize] = useState(100);

  // Update grid size based on container width
  useEffect(() => {
    const container = containerRef.current;
    const updateGridSize = () => {
      if (container) {
        const containerWidth = container.getBoundingClientRect().width;
        setGridSize(containerWidth / 10); // Divide container into 10 columns
      }
    };
    updateGridSize();
    window.addEventListener('resize', updateGridSize);
    return () => window.removeEventListener('resize', updateGridSize);
  }, []);

  const handleDragStart = () => {
    setIsDragging(true);
    // Capture the current scroll position when dragging starts
    setScrollYStart(window.scrollY);
  };

  const handleDragEnd = ({ active, delta }) => {
    setIsDragging(false);

    const blockIndex = blocks.findIndex((block) => block.id === active.id);
    if (blockIndex === -1) return;

    const updatedBlocks = [...blocks];
    const blockToUpdate = updatedBlocks[blockIndex];

    // Get container dimensions
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    // Compute initial absolute positions
    const initialX = (blockToUpdate.x / 100) * containerWidth;
    const initialY = (blockToUpdate.y / 100) * containerHeight;

    // Adjust delta.y by subtracting the scroll difference
    const scrollYEnd = window.scrollY;
    const scrollDeltaY = scrollYEnd - scrollYStart;

    const deltaX = delta.x;
    const deltaY = delta.y - scrollDeltaY;

    // Compute new absolute positions
    const newX = initialX + deltaX;
    const newY = initialY + deltaY;

    // Compute new percentages
    const newPercentageX = (newX / containerWidth) * 100;
    const newPercentageY = (newY / containerHeight) * 100;

    // Clamp values between 0 and 100
    blockToUpdate.x = Math.max(0, Math.min(newPercentageX, 100));
    blockToUpdate.y = Math.max(0, Math.min(newPercentageY, 100));

    updateBlocks(updatedBlocks);
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen">
      {previewMode ? (
        // In preview mode, simply render the blocks without drag-and-drop functionality
        blocks.map((block) => (
          <div
            key={block.id}
            style={{
              position: 'absolute',
              left: `${block.x}%`,
              top: `${block.y}%`,
            }}
          >
            <Block block={block} />
          </div>
        ))
      ) : (
        // In edit mode, enable drag-and-drop functionality
        <DndContext
          onDragStart={handleDragStart}
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
            <DraggableBlock key={block.id} block={block} />
          ))}
        </DndContext>
      )}
    </div>
  );
};

export default SectionContent;