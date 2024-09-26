import React, { useContext } from 'react';
import { DndContext, useDraggable, useDroppable, closestCenter } from '@dnd-kit/core';
import { PreviewModeContext } from '../../PreviewModeContext';
import { CSS } from '@dnd-kit/utilities';
import Block from '../Block/Block';

const DraggableBlock = ({ block, index, moveBlock }) => {
  const { previewMode } = useContext(PreviewModeContext);

  const { attributes, listeners, setNodeRef, transform, transition } = useDraggable({
    id: block.id,
    disabled: previewMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: previewMode ? 1 : transform ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 bg-white shadow-md rounded-md ${!previewMode ? 'cursor-move' : ''}`}
      {...(!previewMode && { ...attributes, ...listeners })}
    >
      <Block block={block} />
    </div>
  );
};

const DroppableContainer = ({ children, id }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div ref={setNodeRef}>
      {children}
    </div>
  );
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
    <>
      {!previewMode ? (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className={`grid grid-cols-${gridColumns} gap-4`}>
            {blocks.map((block, index) => (
              <DroppableContainer key={block.id} id={block.id}>
                <DraggableBlock block={block} index={index} moveBlock={updateBlocks} />
              </DroppableContainer>
            ))}
          </div>
        </DndContext>
      ) : (
        <div className={`grid grid-cols-${gridColumns} gap-4`}>
          {blocks.map((block) => (
            <div key={block.id} className="p-4 bg-white shadow-md rounded-md">
              <Block block={block} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SectionContent;
