import React, { useEffect, useRef } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import './HighlightWidget.css';
import SortableArticleWidget from './SortableArticleWidget';
import { FaArrowsAlt } from 'react-icons/fa';

function HighlightWidget({
  id,
  content,
  onUpdate,
  isEditing,
  setIsEditing,
  onContextMenu,
  onHeightChange,
  rowHeight,
}) {
  const contentRef = useRef(null);
  const prevH = useRef();

  // Use content.widgets directly
  const widgets = content.widgets || [];

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
    onUpdate(id, { ...content, widgets: updatedWidgets });
  };

  const updateInnerWidget = (widgetId, widgetContent) => {
    const updatedWidgets = widgets.map((widget) =>
      widget.id === widgetId ? { ...widget, content: widgetContent } : widget
    );
    onUpdate(id, { ...content, widgets: updatedWidgets });
  };

  const deleteInnerWidget = (widgetId) => {
    const updatedWidgets = widgets.filter((widget) => widget.id !== widgetId);
    onUpdate(id, { ...content, widgets: updatedWidgets });
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = widgets.findIndex((widget) => widget.id === active.id);
      const newIndex = widgets.findIndex((widget) => widget.id === over.id);
      const updatedWidgets = arrayMove(widgets, oldIndex, newIndex);
      onUpdate(id, { ...content, widgets: updatedWidgets });
    }
  };

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      const newH = Math.max(4, Math.ceil(contentHeight / rowHeight));
      if (prevH.current !== newH) {
        onHeightChange(id, newH);
        prevH.current = newH;
      }
    }
  }, [widgets, onHeightChange, id, rowHeight]);

  return (
    <div
      className="highlight-widget"
      onContextMenu={(e) => {
        e.stopPropagation();
        if (onContextMenu) onContextMenu(e);
      }}
      ref={contentRef}
      style={{ boxSizing: 'border-box' }}
    >
      <div className="widget-drag-handle">
        <FaArrowsAlt />
      </div>
      <button
        className="add-article-button"
        onClick={() => addInnerWidget('Article')}
      >
        Add Article
      </button>
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
