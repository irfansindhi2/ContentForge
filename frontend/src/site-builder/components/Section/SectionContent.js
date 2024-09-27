import React, { useContext } from 'react';
import { DndContext } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { snapToGrid } from '../../utils/modifiers';
import { PreviewModeContext } from '../../PreviewModeContext';
import DraggableBlock from '../Block/DraggableBlock';
import Block from '../Block/Block';

const SectionContent = ({ blocks, updateBlocks }) => {
  const { previewMode } = useContext(PreviewModeContext);

  const handleDragEnd = ({ active, delta }) => {
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
        <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToParentElement, snapToGrid(100)]}>
          {blocks.map((block) => (
            <DraggableBlock key={block.id} block={block} />
          ))}
        </DndContext>
      )}
    </div>
  );
};

export default SectionContent;