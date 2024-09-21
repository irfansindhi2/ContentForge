import React, { useState, useEffect, useRef } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './HighlightWidget.css';
import SortableArticleWidget from './SortableArticleWidget';
import { FaArrowsAlt } from 'react-icons/fa';

import ArticleWidget from './ArticleWidget';

function HighlightWidget({
  id,
  content,
  onUpdate,
  isEditing,
  setIsEditing,
  onContextMenu,
  onHeightChange, // Receive the callback prop
  rowHeight,      // Receive rowHeight from parent
}) {
  const [widgets, setWidgets] = useState(content.widgets || []);
  const contentRef = useRef(null);

  useEffect(() => {
    setWidgets(content.widgets || []);
  }, [content.widgets]);

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.offsetHeight;
      const newH = Math.ceil(contentHeight / rowHeight);
      onHeightChange(id, newH);
    }
  }, [widgets, onHeightChange, id, rowHeight]);


  const addInnerWidget = (type) => {
    const defaultContent = {
      Article: {
        title: 'Article Title',
        body: 'Article content goes here...',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        fontSize: '16px',
      },
    };

    const newWidget = {
      id: `${type}-${Date.now()}`,
      type: type,
      content: defaultContent[type],
    };

    const updatedWidgets = [...widgets, newWidget];
    setWidgets(updatedWidgets);
    onUpdate(id, { ...content, widgets: updatedWidgets });
  };

  const updateInnerWidget = (widgetId, widgetContent) => {
    const updatedWidgets = widgets.map((widget) =>
      widget.id === widgetId ? { ...widget, content: widgetContent } : widget
    );
    setWidgets(updatedWidgets);
    onUpdate(id, { ...content, widgets: updatedWidgets });
  };

  const deleteInnerWidget = (widgetId) => {
    const updatedWidgets = widgets.filter((widget) => widget.id !== widgetId);
    setWidgets(updatedWidgets);
    onUpdate(id, { ...content, widgets: updatedWidgets });
  };

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = widgets.findIndex((widget) => widget.id === active.id);
      const newIndex = widgets.findIndex((widget) => widget.id === over.id);
      const updatedWidgets = arrayMove(widgets, oldIndex, newIndex);
      setWidgets(updatedWidgets);
      onUpdate(id, { ...content, widgets: updatedWidgets });
    }
  };

  return (
    <div className="highlight-widget" onContextMenu={onContextMenu} ref={contentRef}>
      <div className="widget-drag-handle">
        <FaArrowsAlt />
      </div>
      <button
        className="add-article-button"
        onClick={() => addInnerWidget('Article')}
      >
        Add Article
      </button>
      <div className="highlight-toolbar">
        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Done' : 'Edit'}
        </button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={widgets.map((widget) => widget.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="inner-widgets-container">
            {widgets.map((widget) => (
              <SortableArticleWidget
                key={widget.id}
                id={widget.id}
                content={widget.content}
                onUpdate={updateInnerWidget}
                onDelete={() => deleteInnerWidget(widget.id)}
                isNested={true}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default HighlightWidget;