import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

function ArticleWidget({ id, index, content, onUpdate, onDelete, moveWidget }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'WIDGET',
    item: { id, index, type: 'Article' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'WIDGET',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveWidget(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => drag(drop(node))} style={{ opacity: isDragging ? 0.5 : 1 }} className="widget article-widget">
      <h2>Article</h2>
      <input
        type="text"
        value={content.title || ''}
        onChange={(e) => onUpdate(id, { ...content, title: e.target.value })}
        placeholder="Article Title"
      />
      <textarea
        value={content.body || ''}
        onChange={(e) => onUpdate(id, { ...content, body: e.target.value })}
        placeholder="Article Body"
      />
      <button onClick={() => onDelete(id)}>Delete</button>
    </div>
  );
}

export default ArticleWidget;