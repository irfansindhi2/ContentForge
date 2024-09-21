// SortableArticleWidget.js
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ArticleWidget from './ArticleWidget';

function SortableArticleWidget({ id, content, onUpdate, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handlePointerDown = (event) => {
    event.stopPropagation();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onPointerDown={handlePointerDown}
    >
      <ArticleWidget
        id={id}
        content={content}
        onUpdate={onUpdate}
        onDelete={onDelete}
        isNested={true}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export default SortableArticleWidget;