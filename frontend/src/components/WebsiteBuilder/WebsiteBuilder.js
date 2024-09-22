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
    };

    const newWidget = {
      i: `${type}-${Date.now()}`,
      x: 0,
      y: 0, // Place header at the top
      w: type === 'Header' || type === 'Footer' ? totalColumns : 6,
      h: 4, // Default height
      type: type,
      content: defaultContent[type],
    };

    if (type === 'Header') {
      const headerHeight = newWidget.h;

      // Adjust y positions of existing widgets
      const adjustedWidgets = widgets.map((widget) => {
        return {
          ...widget,
          y: widget.y + headerHeight,
        };
      });

      // Set the new widgets with adjusted positions and the new header widget
      setWidgets([newWidget, ...adjustedWidgets]);
    } else if (type === 'Footer') {
      // Calculate the maximum y position among existing widgets
      const maxY = widgets.reduce((acc, widget) => {
        return Math.max(acc, widget.y + widget.h);
      }, 0);

      const newWidgetWithAdjustedY = {
        ...newWidget,
        y: maxY, // Place footer below all widgets
      };

      setWidgets([...widgets, newWidgetWithAdjustedY]);
    } else {
      const headerWidget = widgets.find((widget) => widget.type === 'Header');
      const headerHeight = headerWidget ? headerWidget.h : 0;

      const newWidgetWithAdjustedY = {
        ...newWidget,
        y: headerHeight, // Place new widgets below the header
      };

      setWidgets([...widgets, newWidgetWithAdjustedY]);
    }
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
    if (headerWidget) {
      headerWidget.y = 0;
      
      // Adjust other widgets if they overlap with the header
      const headerHeight = headerWidget.h;
      layout.forEach((item) => {
        if (item.i !== headerWidget.i && item.y < headerHeight) {
          item.y = headerHeight;
        }
      });
    }

    const footerWidget = widgets.find((widget) => widget.type === 'Footer');

    if (footerWidget) {
      // Find maximum y position excluding the footer
      const maxY = layout.reduce((acc, item) => {
        if (!item.i.startsWith('Footer-')) {
          return Math.max(acc, item.y + item.h);
        }
        return acc;
      }, 0);

      // Update the footer's position in the layout
      const footerItem = layout.find((item) => item.i.startsWith('Footer-'));
      if (footerItem) {
        footerItem.y = maxY; // Place footer below all widgets
      } else {
        // If footer is not in layout, add it
        layout.push({
          i: footerWidget.i,
          x: 0,
          y: maxY,
          w: totalColumns,
          h: footerWidget.h,
        });
      }
    }

    setWidgets(
      widgets.map((widget) => {
        const updatedPosition = layout.find((item) => item.i === widget.i);
        return updatedPosition ? { ...widget, ...updatedPosition } : widget;
      })
    );
  };

  const downloadCurrentLayout = () => {
    const htmlContent = `
      <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Generated Website</title>
      <style>
        body, html {
          margin: 0;
          padding: 0;
          height: 100%;
        }
        .layout {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-auto-rows: minmax(30px, auto);
          gap: 10px;
          padding: 20px;
          height: calc(100% - 40px);
        }
        .widget {
          overflow: auto;
          padding: 10px;
          border: 1px solid #ccc;
        }
      </style>
    </head>
    <body>
      <div class="layout">
        ${widgets.map(widget => {
      const content = widget.content || {};
      const gridArea = `${widget.y + 1} / ${widget.x + 1} / span ${widget.h} / span ${widget.w}`;
      switch (widget.type) {
        case 'Header':
          return `
                <div class="widget" style="grid-area: ${gridArea}; background-color: ${content.backgroundColor || '#ffffff'};">
                  <h1 style="color: ${content.textColor || '#000000'}; text-align: ${content.alignment || 'left'};">
                    ${content.title || 'Header'}
                  </h1>
                  <p style="color: ${content.textColor || '#000000'};">${content.subtitle || ''}</p>
                </div>
              `;
        case 'Footer':
          return `
                <div class="widget" style="grid-area: ${gridArea}; background-color: ${content.backgroundColor || '#ffffff'}; color: ${content.textColor || '#000000'};">
                  <p>${content.copyright || ''}</p>
                  <nav>
                    ${(content.links || []).map(link => `<a href="${link.url || '#'}" style="color: ${content.textColor || '#000000'};">${link.text || 'Link'}</a>`).join(' ')}
                  </nav>
                </div>
              `;
        case 'Article':
          return `
                <div class="widget" style="grid-area: ${gridArea}; background-color: ${content.backgroundColor || '#ffffff'}; color: ${content.textColor || '#000000'}; font-size: ${content.fontSize || '16px'};">
                  <h2>${content.title || 'Article Title'}</h2>
                  <p>${content.body || 'Article content'}</p>
                </div>
              `;
        case 'Slider':
          return `
                <div class="widget" style="grid-area: ${gridArea}; background-color: ${content.backgroundColor || '#ffffff'};">
                  <div class="slider">
                    ${(content.imageUrls || []).map(url => `<img src="${url}" alt="Slider image" style="max-width: 100%;">`).join('')}
                  </div>
                </div>
              `;
        case 'Menu':
          return `
                <div class="widget" style="grid-area: ${gridArea}; background-color: ${content.backgroundColor || '#ffffff'};">
                  <nav>
                    ${(content.menuItems || []).map(item => `<a href="#" style="color: ${content.textColor || '#000000'};">${item}</a>`).join(' ')}
                  </nav>
                </div>
              `;
        case 'Ad':
          return `
                <div class="widget" style="grid-area: ${gridArea}; background-color: ${content.backgroundColor || '#ffffff'};">
                  <a href="${content.linkUrl || '#'}" target="_blank">
                    <img src="${content.imageUrl || ''}" alt="Advertisement" style="max-width: 100%;">
                  </a>
                </div>
              `;
        case 'Text':
          return `
                <div class="widget" style="grid-area: ${gridArea}; background-color: ${content.backgroundColor || '#ffffff'}; color: ${content.textColor || '#000000'}; font-size: ${content.fontSize || '16px'}; text-align: ${content.alignment || 'left'};">
                  <p>${content.text || ''}</p>
                </div>
              `;
        default:
          return '';
      }
    }).join('')}
      </div>
    </body>
    </html>
  `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated_website.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCanvasClick = (e) => {
    if (e.target.classList.contains('canvas-container')) {
      setEditingWidget(null);
    }
  };

  const onDrag = (layout, oldItem, newItem) => {
    const headerWidget = layout.find((item) => item.i.startsWith('Header-'));
    if (headerWidget) {
      headerWidget.y = 0;
      
      // Prevent other widgets from being placed above the header
      if (newItem.i !== headerWidget.i && newItem.y < headerWidget.h) {
        newItem.y = headerWidget.h;
      }
    }

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
          <button onClick={downloadCurrentLayout}>Download Layout</button>
        </div>
        <div className="canvas-container" onClick={handleCanvasClick}>
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: widgets }}
            onBreakpointChange={onBreakpointChange}
            cols={cols}
            rowHeight={15}
            width={1200}
            onLayoutChange={onLayoutChange}
            onDrag={onDrag}
            isResizable={true}
            isDraggable={true}
            containerPadding={[0, 0]}
            margin={[0, 0]}
            compactType={null}
            preventCollision={false}
            useCSSTransforms={true}
            draggableHandle=".widget-drag-handle"
            draggableCancel=".nested-draggable"
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
              }[widget.type];

              const isHeader = widget.type === 'Header';
              const isFooter = widget.type === 'Footer';

              const gridData = {
                ...widget,
                isDraggable: !isHeader,
                isResizable: true,
                y: isHeader ? 0 : widget.y,
                minW: isHeader || isFooter ? totalColumns : 1,
                maxW: isHeader || isFooter ? totalColumns : undefined,
                minH: widget.minH || 1,
              };

              return (
                <div
                  key={widget.i}
                  data-grid={gridData}
                  className={`widget-container ${isHeader ? 'header-widget' : ''}`}
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