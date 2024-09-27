import React, { useContext } from 'react';
import { DndContext, useDroppable, closestCenter } from '@dnd-kit/core';
import { PreviewModeContext } from '../../PreviewModeContext';
import DraggableBlock from '../Block/DraggableBlock';

const DroppableContainer = ({ children, id }) => {
  const { setNodeRef } = useDroppable({ id });
  return <div ref={setNodeRef}>{children}</div>;
};

const SectionContent = ({ blocks, updateBlocks }) => {
  const { previewMode } = useContext(PreviewModeContext);

  const handleDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over?.id);

      if (newIndex === -1) return;

      const newBlocks = [...blocks];
      const [movedBlock] = newBlocks.splice(oldIndex, 1);
      newBlocks.splice(newIndex, 0, movedBlock);

      updateBlocks(newBlocks);
    }
  };

  const gridColumns = 3; // Adjust as needed

  return (
    <div className={`grid grid-cols-${gridColumns} gap-4`}>
      {previewMode ? (
        blocks.map((block) => (
          <DraggableBlock key={block.id} block={block} isPreview={true} />
        ))
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          {blocks.map((block) => (
            <DroppableContainer key={block.id} id={block.id}>
              <DraggableBlock block={block} />
            </DroppableContainer>
          ))}
        </DndContext>
      )}
    </div>
  );
};

export default SectionContent;