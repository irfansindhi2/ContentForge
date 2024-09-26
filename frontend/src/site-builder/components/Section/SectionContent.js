// components/Section/SectionContent.js
import React, { useContext } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PreviewModeContext } from '../../PreviewModeContext';
import Block from '../Block/Block';

const SortableItem = ({ block }) => {
  const { previewMode } = useContext(PreviewModeContext);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: block.id, disabled: previewMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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

const SectionContent = ({ blocks, updateBlocks }) => {
  const { previewMode } = useContext(PreviewModeContext);

  const handleDragEnd = ({ active, over }) => {
    if (active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);

      const newBlocks = arrayMove(blocks, oldIndex, newIndex);
      updateBlocks(newBlocks);
    }
  };

  const gridColumns = 3; // Adjust as needed

  return (
    <>
      {!previewMode ? (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blocks} strategy={rectSortingStrategy}>
            <div className={`grid grid-cols-${gridColumns} gap-4`}>
              {blocks.map((block) => (
                <SortableItem key={block.id} block={block} />
              ))}
            </div>
          </SortableContext>
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