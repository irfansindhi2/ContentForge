import React, { useContext, useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { snapToGrid } from '../../utils/modifiers';
import { PreviewModeContext } from '../../PreviewModeContext';
import DraggableBlock from '../Block/DraggableBlock';
import Block from '../Block/Block';

const SectionContent = ({ blocks, updateBlocks }) => {
  const { previewMode } = useContext(PreviewModeContext);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true); // Set dragging to true when drag starts
  };

  const handleDragEnd = ({ active, delta }) => {
    setIsDragging(false);

    const blockIndex = blocks.findIndex((block) => block.id === active.id);
    if (blockIndex === -1) return;

    const updatedBlocks = [...blocks];
    const blockToUpdate = updatedBlocks[blockIndex];

    // Update block's x and y coordinates after dragging
    blockToUpdate.x = (blockToUpdate.x || 0) + delta.x;
    blockToUpdate.y = (blockToUpdate.y || 0) + delta.y;

    updateBlocks(updatedBlocks);
  };

  return (
    <div className="relative w-full h-screen">
      {previewMode ? (
        // In preview mode, simply render the blocks without drag-and-drop functionality
        blocks.map((block) => (
          <div key={block.id} style={{ position: 'absolute', left: block.x, top: block.y }}>
            <Block block={block} />
          </div>
        ))
      ) : (
        // In edit mode, enable drag-and-drop functionality
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToParentElement, snapToGrid(100)]}
        >
          {/* Conditionally render grid overlay when dragging */}
          {isDragging && (
            <div className="absolute inset-0 z-0 grid grid-cols-12 grid-rows-12 gap-2 pointer-events-none">
              {/* Create the grid background */}
              {[...Array(144)].map((_, idx) => (
                <div key={idx} className="border border-gray-200"></div>
              ))}
            </div>
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