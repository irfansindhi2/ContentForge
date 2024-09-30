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
import { snapToGrid, restrictToContainer, pixelsToGrid } from '../../utils/gridUtils';

const SectionContent = ({ blocks, updateBlocks, columns = 24, rowHeight = 50 }) => {
  const { previewMode } = useContext(PreviewModeContext);
  const [activeId, setActiveId] = useState(null);
  const containerRef = useRef(null);
  const [containerRect, setContainerRect] = useState(null);

  // State to hold dimensions of blocks
  const [blockDimensions, setBlockDimensions] = useState({});

  useEffect(() => {
    if (containerRef.current) {
      setContainerRect(containerRef.current.getBoundingClientRect());
    }
  }, []);

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
        const blockHeight = Math.ceil(dimensions.height / rowHeight); // Convert to grid units and round up
        maxY = Math.max(maxY, block.y + blockHeight);
      }
    });

    // Add some padding if needed
    return `${maxY * rowHeight}px`;
  }, [blocks, blockDimensions, rowHeight]);

  // Define sensors for touch and mouse support
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
  };

  const handleDragEnd = ({ active, over, delta }) => {
    setActiveId(null);
  
    if (!containerRect) return;

    const blockIndex = blocks.findIndex((block) => block.id === active.id);
    if (blockIndex === -1) return;
  
    const updatedBlocks = [...blocks];
    const blockToUpdate = updatedBlocks[blockIndex];
  
    const { x: newGridX, y: newGridY } = pixelsToGrid(
      blockToUpdate.x * containerRect.width / columns + delta.x,
      blockToUpdate.y * rowHeight + delta.y,
      containerRect,
      columns,
      rowHeight
    );
  
    // Update block position
    blockToUpdate.x = newGridX;
    blockToUpdate.y = newGridY;
  
    updateBlocks(updatedBlocks);
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{
        minHeight: containerHeight,
        overflow: 'visible',
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        '--grid-columns': columns,
        '--row-height': `${rowHeight}px`,
      }}
    >
      {previewMode ? (
        // In preview mode, render blocks without drag-and-drop
        blocks.map((block) => (
          <BlockWrapper
            key={block.id}
            block={block}
            setBlockDimensions={handleSetBlockDimensions}
            columns={columns}
            rowHeight={rowHeight}
            containerRect={containerRect}
          />
        ))
      ) : (
        // In edit mode, enable drag-and-drop functionality
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={containerRect ? [
            snapToGrid(containerRect, columns, rowHeight),
            restrictToContainer(containerRect)
          ] : []}
        >
          {/* Render grid overlay */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundSize: `calc(100% / var(--grid-columns)) var(--row-height)`,
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
              columns={columns}
              rowHeight={rowHeight}
              containerRect={containerRect}
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