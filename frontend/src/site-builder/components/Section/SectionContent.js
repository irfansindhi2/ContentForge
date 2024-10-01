import React, { useContext, useState, useMemo, useRef } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { PreviewModeContext } from '../../PreviewModeContext';
import Block from '../Block/Block';
import GridOverlay from './GridOverlay';
import { generateResponsiveLayouts, updateBlockLayout } from '../../utils/layoutUtils';
import { useMeasure } from 'react-use';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const SectionContent = ({ blocks, updateBlocks }) => {
  const { previewMode } = useContext(PreviewModeContext);
  const [isDragging, setIsDragging] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');
  const [ref, { width }] = useMeasure();

  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
  const cols = { lg: 24, md: 24, sm: 8, xs: 8, xxs: 3 };
  const rowHeights = { lg: 50, md: 40, sm: 30, xs: 20, xxs: 10 };
  const margins = { lg: [10, 10], md: [8, 8], sm: [6, 6], xs: [4, 4], xxs: [2, 2] };
  const containerPadding = [0, 0];

  const layouts = useMemo(() => generateResponsiveLayouts(blocks, cols), [blocks, cols]);

  const maxRows = useMemo(() => {
    if (!layouts[currentBreakpoint] || layouts[currentBreakpoint].length === 0) {
      return 1;
    }
    const max = layouts[currentBreakpoint].reduce((max, item) => {
      const total = (item.y || 0) + (item.h || 0);
      return Math.max(max, total);
    }, 0);
    return Math.max(Math.floor(max), 1);
  }, [layouts, currentBreakpoint]);

  // New state variable for overlay max rows
  const [overlayMaxRows, setOverlayMaxRows] = useState(maxRows);

  const handleLayoutChange = (currentLayout, allLayouts) => {
    if (!previewMode) {
      const updatedBlocks = updateBlockLayout(blocks, currentLayout);
      updateBlocks(updatedBlocks);
    }
  };

  const handleDrag = (layout, oldItem, newItem, placeholder) => {
    const totalRows = placeholder.y + placeholder.h;
    if (totalRows !== overlayMaxRows) {
      setOverlayMaxRows(totalRows);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragStop = () => {
    setIsDragging(false);
    // Reset overlay max rows after dragging
    setOverlayMaxRows(maxRows);
  };

  const handleResize = (layout, oldItem, newItem, placeholder) => {
    const totalRows = placeholder.y + placeholder.h;
    if (totalRows !== overlayMaxRows) {
      setOverlayMaxRows(totalRows);
    }
  };

  const handleResizeStop = () => {
    setIsDragging(false);
    // Reset overlay max rows after resizing
    setOverlayMaxRows(maxRows);
  };

  return (
    <div className="relative w-full" ref={ref}>
      {isDragging && !previewMode && (
        <GridOverlay
          cols={cols[currentBreakpoint]}
          margin={margins[currentBreakpoint]}
          containerPadding={containerPadding}
          containerWidth={width}
          rowHeight={rowHeights[currentBreakpoint]}
          maxRows={overlayMaxRows}
        />
      )}
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={breakpoints}
        cols={cols}
        rowHeight={rowHeights[currentBreakpoint]}
        margin={margins[currentBreakpoint]}
        containerPadding={containerPadding}
        onBreakpointChange={(breakpoint) => setCurrentBreakpoint(breakpoint)}
        onLayoutChange={handleLayoutChange}
        isDraggable={!previewMode}
        isResizable={!previewMode}
        compactType={null}
        preventCollision
        onDragStart={handleDragStart}
        onDrag={handleDrag} // Update overlay during drag
        onDragStop={handleDragStop}
        onResizeStart={handleDragStart}
        onResize={handleResize} // Update overlay during resize
        onResizeStop={handleResizeStop}
      >
        {blocks.map((block) => (
          <div key={block.id} className="bg-white shadow-lg rounded-md overflow-hidden">
            <Block block={block} />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default SectionContent;