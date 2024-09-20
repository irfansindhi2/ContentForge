import React, { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import './HighlightWidget.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Import your widget components
import HeaderWidget from './HeaderWidget';
import FooterWidget from './FooterWidget';
import ArticleWidget from './ArticleWidget';
// ... other widgets

const ResponsiveGridLayout = WidthProvider(Responsive);

function HighlightWidget({ id, content, onUpdate }) {
  const [widgets, setWidgets] = useState(content.widgets || []);
  const [isEditing, setIsEditing] = useState(false);

  const addInnerWidget = (type) => {
    const defaultContent = {
      // ... default content for inner widgets
    };

    const newWidget = {
      i: `${type}-${Date.now()}`,
      x: 0,
      y: 0,
      w: 6,
      h: 4,
      type: type,
      content: defaultContent[type],
    };

    setWidgets([...widgets, newWidget]);
    // Update the parent content
    onUpdate(id, { widgets: [...widgets, newWidget] });
  };

  const updateInnerWidget = (widgetId, content) => {
    const updatedWidgets = widgets.map((widget) =>
      widget.i === widgetId ? { ...widget, content } : widget
    );
    setWidgets(updatedWidgets);
    onUpdate(id, { widgets: updatedWidgets });
  };

  const deleteInnerWidget = (widgetId) => {
    const updatedWidgets = widgets.filter((widget) => widget.i !== widgetId);
    setWidgets(updatedWidgets);
    onUpdate(id, { widgets: updatedWidgets });
  };

  return (
    <div className="highlight-widget">
      <div className="highlight-toolbar">
        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Done' : 'Edit'}
        </button>
        {isEditing && (
          <>
            <button onClick={() => addInnerWidget('Header')}>Add Header</button>
            <button onClick={() => addInnerWidget('Article')}>Add Article</button>
            {/* Add buttons for other widgets */}
          </>
        )}
      </div>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: widgets }}
        breakpoints={{ lg: 1200 }}
        cols={{ lg: 12 }}
        rowHeight={30}
        width={600}
        isDraggable={isEditing}
        isResizable={isEditing}
        onLayoutChange={(layout) => {
          const updatedWidgets = widgets.map((widget) => {
            const updatedPosition = layout.find((item) => item.i === widget.i);
            return updatedPosition ? { ...widget, ...updatedPosition } : widget;
          });
          setWidgets(updatedWidgets);
          onUpdate(id, { widgets: updatedWidgets });
        }}
      >
        {widgets.map((widget) => {
          const InnerWidgetComponent = {
            Header: HeaderWidget,
            Article: ArticleWidget,
            // ... other widgets
          }[widget.type];

          return (
            <div key={widget.i} data-grid={widget}>
              <InnerWidgetComponent
                id={widget.i}
                content={widget.content}
                onUpdate={updateInnerWidget}
                onDelete={() => deleteInnerWidget(widget.i)}
                isEditing={isEditing}
              />
            </div>
          );
        })}
      </ResponsiveGridLayout>
    </div>
  );
}

export default HighlightWidget;
