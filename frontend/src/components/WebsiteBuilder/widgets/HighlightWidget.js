import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import './HighlightWidget.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import HeaderWidget from './HeaderWidget';
import ArticleWidget from './ArticleWidget';

const ResponsiveGridLayout = WidthProvider(Responsive);

function HighlightWidget({ id, content, onUpdate }) {
  const [widgets, setWidgets] = useState(content.widgets || []);
  const [isEditing, setIsEditing] = useState(false);
  const [editingWidget, setEditingWidget] = useState(null);

  useEffect(() => {
    setWidgets(content.widgets || []);
  }, [content.widgets]);

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
      i: `${type}-${Date.now()}`,
      x: 0,
      y: Infinity,
      w: 6,
      h: 4,
      type: type,
      content: defaultContent[type],
    };

    const updatedWidgets = [...widgets, newWidget];
    setWidgets(updatedWidgets);
    onUpdate(id, { ...content, widgets: updatedWidgets });
  };

  const updateInnerWidget = (widgetId, widgetContent) => {
    const updatedWidgets = widgets.map((widget) =>
      widget.i === widgetId ? { ...widget, content: widgetContent } : widget
    );
    setWidgets(updatedWidgets);
    onUpdate(id, { ...content, widgets: updatedWidgets });
  };

  const deleteInnerWidget = (widgetId) => {
    const updatedWidgets = widgets.filter((widget) => widget.i !== widgetId);
    setWidgets(updatedWidgets);
    onUpdate(id, { ...content, widgets: updatedWidgets });
  };

  return (
    <div className="highlight-widget">
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
          onUpdate(id, { ...content, widgets: updatedWidgets });
        }}
      >
        {widgets.map((widget) => {
          const InnerWidgetComponent = {
            Header: HeaderWidget,
            Article: ArticleWidget,
          }[widget.type];

          return (
            <div key={widget.i} data-grid={widget}>
              <InnerWidgetComponent
                id={widget.i}
                content={widget.content}
                onUpdate={updateInnerWidget}
                onDelete={() => deleteInnerWidget(widget.i)}
                isEditing={editingWidget && editingWidget.i === widget.i}
                setIsEditing={(isEditing) =>
                  setEditingWidget(isEditing ? widget : null)
                }
              />
            </div>
          );
        })}
      </ResponsiveGridLayout>
    </div>
  );
}

export default HighlightWidget;
