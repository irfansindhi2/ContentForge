import React, { useState, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Responsive, WidthProvider } from 'react-grid-layout';
import './WebsiteBuilder.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Import your existing widget components
import HeaderWidget from './widgets/HeaderWidget';
import FooterWidget from './widgets/FooterWidget';
import ArticleWidget from './widgets/ArticleWidget';
import SliderWidget from './widgets/SliderWidget';
import MenuWidget from './widgets/MenuWidget';
import AdWidget from './widgets/AdWidget';
import TextWidget from './widgets/TextWidget';
import HighlightWidget from './widgets/HighlightWidget';
import SectionWidget from './widgets/SectionWidget'; // Import SectionWidget
import ContextMenu from './ContextMenu';

const ResponsiveGridLayout = WidthProvider(Responsive);

function WebsiteBuilder() {
  const [widgets, setWidgets] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [editingWidget, setEditingWidget] = useState(null);
  const [draggedWidgetPosition, setDraggedWidgetPosition] = useState(null);

  const previousHeaderHeightRef = useRef(0);
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');

  const cols = { lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 };
  const [totalColumns, setTotalColumns] = useState(cols[currentBreakpoint]);

  const rowHeight = 15;

  const addWidget = (type) => {
    const headerWidget = widgets.find((widget) => widget.type === 'Header');
    const headerHeight = headerWidget ? headerWidget.h : 0;

    const defaultContent = {
      Header: { title: 'Welcome', subtitle: 'to our website', backgroundColor: '#f8f9fa', textColor: '#333333', alignment: 'center' },
      Footer: { copyright: '© 2023 Your Company', links: [], backgroundColor: '#f8f9fa', textColor: '#333333' },
      Article: { title: 'Article Title', body: 'Article content goes here...', backgroundColor: '#ffffff', textColor: '#000000', fontSize: '16px' },
      Slider: { imageUrls: [], backgroundColor: '#ffffff' },
      Menu: { menuItems: ['Home', 'About', 'Contact'], backgroundColor: '#f8f9fa', textColor: '#333333' },
      Ad: { imageUrl: '', linkUrl: '', backgroundColor: '#ffffff' },
      Text: { text: 'Enter your text here', backgroundColor: '#ffffff', textColor: '#000000', fontSize: '16px', alignment: 'left' },
      Highlight: { widgets: [] },
      Section: { widgets: [] },
    };

    const newWidget = {
      i: `${type}-${Date.now()}`,
      x: 0,
      y: Infinity,
      w: type === 'Header' || type === 'Footer' || type === 'Section' ? totalColumns : 6,
      h: 4, // Default height
      type: type,
      content: defaultContent[type],
    };

    if (type === 'Section') {
      newWidget.minW = totalColumns;
      newWidget.maxW = totalColumns;
    }

    let updatedWidgets;

    if (type === 'Header') {
      newWidget.y = 0;
      // Adjust y positions of existing widgets
      updatedWidgets = widgets.map((widget) => ({
        ...widget,
        y: widget.y + newWidget.h,
      }));
      updatedWidgets = [newWidget, ...updatedWidgets];
    } else if (type === 'Footer') {
      // Find the maximum y position
      const maxY = widgets.reduce((max, widget) => Math.max(max, widget.y + widget.h), 0);
      newWidget.y = maxY;
      updatedWidgets = [...widgets, newWidget];
    } else {
      // For other widgets, place them directly below the header
      newWidget.y = Infinity;
      updatedWidgets = [...widgets, newWidget];
    }

    setWidgets(updatedWidgets);
  };

  const updateWidget = (id, content) => {
    setWidgets(widgets.map(widget =>
      widget.i === id ? { ...widget, content } : widget
    ));
  };

  const deleteWidget = (id) => {
    setWidgets(widgets.filter(widget => widget.i !== id));
  };

  const handleContextMenu = (e, widget) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      widget: widget
    });
  };

  const handleEdit = () => {
    setEditingWidget(contextMenu.widget);
    setContextMenu(null);
  };

  const handleDelete = () => {
    deleteWidget(contextMenu.widget.i);
    setContextMenu(null);
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const onLayoutChange = (layout) => {
    const headerWidget = layout.find((item) => item.i.startsWith('Header-'));
    const footerWidget = layout.find((item) => item.i.startsWith('Footer-'));

    if (headerWidget) {
      headerWidget.y = 0;
    }

    // Place the footer at the bottom if it exists
    if (footerWidget) {
      // Find the maximum y + h value for all widgets except the footer
      let maxY = 0;
      layout.forEach((item) => {
        if (item.i !== footerWidget.i) {
          maxY = Math.max(maxY, item.y + item.h);
        }
      });
      footerWidget.y = maxY;
    }

    setWidgets(
      layout.map(item => {
        const widget = widgets.find(w => w.i === item.i);
        return widget ? { ...widget, x: item.x, y: item.y, w: item.w, h: item.h } : widget;
      })
    );
  };

  const downloadCurrentLayout = () => {
    // Your download logic here
  };

  const handleCanvasClick = (e) => {
    if (e.target.classList.contains('canvas-container')) {
      setEditingWidget(null);
    }
  };

  const onDrag = (layout, oldItem, newItem) => {
    setDraggedWidgetPosition({
      id: newItem.i,
      x: newItem.x,
      y: newItem.y,
    });
  };

  // Callback to handle height changes from widgets
  const handleWidgetHeightChange = (id, newH, minH) => {
    setWidgets((prevWidgets) => {
      let changed = false;
      const updatedWidgets = prevWidgets.map((widget) => {
        if (widget.i === id) {
          const updatedWidget = { ...widget };
          if (widget.h !== newH) {
            updatedWidget.h = newH;
            changed = true;
          }
          if (widget.minH !== minH) {
            updatedWidget.minH = minH;
            changed = true;
          }
          return updatedWidget;
        }
        return widget;
      });
      // Only update state if something has changed
      return changed ? updatedWidgets : prevWidgets;
    });
  };

  const onBreakpointChange = (breakpoint) => {
    setCurrentBreakpoint(breakpoint);
    setTotalColumns(cols[breakpoint]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="website-builder" onClick={closeContextMenu}>
        <div className="toolbar">
          <button onClick={() => addWidget('Header')}>Add Header</button>
          <button onClick={() => addWidget('Footer')}>Add Footer</button>
          <button onClick={() => addWidget('Article')}>Add Article</button>
          <button onClick={() => addWidget('Slider')}>Add Slider</button>
          <button onClick={() => addWidget('Menu')}>Add Menu</button>
          <button onClick={() => addWidget('Ad')}>Add Ad</button>
          <button onClick={() => addWidget('Text')}>Add Text</button>
          <button onClick={() => addWidget('Highlight')}>Add Highlight</button>
          <button onClick={() => addWidget('Section')}>Add Section</button>
          <button onClick={downloadCurrentLayout}>Download Layout</button>
        </div>
        <div className="canvas-container" onClick={handleCanvasClick}>
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: widgets }}
            onBreakpointChange={onBreakpointChange}
            cols={cols}
            rowHeight={rowHeight}
            width={1200}
            onLayoutChange={onLayoutChange}
            onDrag={onDrag}
            isResizable={true}
            isDraggable={true}
            containerPadding={[0, 0]}
            margin={[0, 0]}
            compactType="vertical" // Vertical stacking
            preventCollision={false}
            useCSSTransforms={true}
            // Removed draggableHandle and draggableCancel
            isDroppable={false}
          >
            {widgets.map(widget => {
              const WidgetComponent = {
                Header: HeaderWidget,
                Footer: FooterWidget,
                Article: ArticleWidget,
                Slider: SliderWidget,
                Menu: MenuWidget,
                Ad: AdWidget,
                Text: TextWidget,
                Highlight: HighlightWidget,
                Section: SectionWidget,
              }[widget.type];

              const isHeader = widget.type === 'Header';
              const isFooter = widget.type === 'Footer';

              const gridData = {
                ...widget,
                isDraggable: !isHeader && !isFooter,
                isResizable: !isHeader && !isFooter,
                y: widget.y,
                minW: isHeader || isFooter || widget.type === 'Section' ? totalColumns : 1,
                maxW: isHeader || isFooter || widget.type === 'Section' ? totalColumns : undefined,
                minH: widget.minH || 1,
              };

              return (
                <div
                  key={widget.i}
                  data-grid={gridData}
                  className={`widget-container`}
                >
                  <WidgetComponent
                    id={widget.i}
                    content={widget.content}
                    onUpdate={updateWidget}
                    onDelete={() => deleteWidget(widget.i)}
                    isEditing={editingWidget && editingWidget.i === widget.i}
                    setIsEditing={(isEditing) => setEditingWidget(isEditing ? widget : null)}
                    onContextMenu={(e) => handleContextMenu(e, widget)}
                    draggedPosition={draggedWidgetPosition}
                    onHeightChange={handleWidgetHeightChange}
                    rowHeight={rowHeight}
                    totalColumns={totalColumns}
                  />
                </div>
              );
            })}
          </ResponsiveGridLayout>
          {contextMenu && (
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </DndProvider>
  );
}

export default WebsiteBuilder;
