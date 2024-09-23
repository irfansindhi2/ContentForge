import React, { useState, useRef, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import './SectionWidget.css';
import HighlightWidget from './HighlightWidget';

const ResponsiveGridLayout = WidthProvider(Responsive);

function SectionWidget({
  id,
  content,
  onUpdate,
  onDelete,
  isEditing,
  setIsEditing,
  onHeightChange,
  rowHeight,
}) {
  const contentRef = useRef(null);
  const prevH = useRef();

  const [widgets, setWidgets] = useState(content.widgets || []);

  const cols = { lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }; // Number of columns inside the section

  const addInnerWidget = (type) => {
    if (type === 'Highlight') {
      const newWidget = {
        i: `${type}-${Date.now()}`,
        x: 0,
        y: Infinity,
        w: 6,
        h: 4,
        type: type,
        content: { widgets: [] },
      };

      setWidgets([...widgets, newWidget]);
    }
  };

  useEffect(() => {
    onUpdate(id, { ...content, widgets });
  }, [widgets]);

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

  const handleLayoutChange = (newLayout) => {
    setWidgets(newLayout.map((item) => {
      const widget = widgets.find((w) => w.i === item.i);
      return widget ? { ...widget, x: item.x, y: item.y, w: item.w, h: item.h } : item;
    }));
  };

  const deleteInnerWidget = (widgetId) => {
    setWidgets(widgets.filter((widget) => widget.i !== widgetId));
  };

  const updateInnerWidget = (widgetId, widgetContent) => {
    setWidgets(widgets.map((widget) =>
      widget.i === widgetId ? { ...widget, content: widgetContent } : widget
    ));
  };

  const handleMouseDown = (e) => {
    // Prevent dragging the Section when interacting inside it
    e.stopPropagation();
  };

  return (
    <div
      className="section-widget"
      ref={contentRef}
      style={{ boxSizing: 'border-box', height: '100%', width: '100%', position: 'relative' }}
      onMouseDown={handleMouseDown}
    >
      <button
        className="add-highlight-button"
        onClick={(e) => {
          e.stopPropagation();
          addInnerWidget('Highlight');
        }}
      >
        Add Highlight
      </button>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: widgets }}
        cols={cols}
        rowHeight={rowHeight}
        width={600} // Adjust as necessary
        onLayoutChange={handleLayoutChange}
        isResizable={true}
        isDraggable={true}
        containerPadding={[0, 0]}
        margin={[0, 0]}
        compactType={null} // Allow free placement inside the section
        preventCollision={false}
        useCSSTransforms={true}
        // No need to set draggableHandle or draggableCancel here
        isDroppable={false}
      >
        {widgets.map(widget => {
          const WidgetComponent = {
            Highlight: HighlightWidget,
          }[widget.type];

          return (
            <div key={widget.i} data-grid={widget} className="widget-container">
              <WidgetComponent
                id={widget.i}
                content={widget.content}
                onUpdate={updateInnerWidget}
                onDelete={() => deleteInnerWidget(widget.i)}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                onContextMenu={(e) => {
                  e.stopPropagation();
                  // Handle context menu for inner widget if needed
                }}
                onHeightChange={onHeightChange}
                rowHeight={rowHeight}
              />
            </div>
          );
        })}
      </ResponsiveGridLayout>
    </div>
  );
}

export default SectionWidget;
