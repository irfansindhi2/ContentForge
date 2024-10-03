import React, { useContext, useState, useMemo, useRef, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { PreviewModeContext } from '../../PreviewModeContext';
import Block from '../Block/Block';
import GridOverlay from './GridOverlay';
import { generateResponsiveLayouts, updateBlockLayout } from '../../utils/layoutUtils';
import { useMeasure } from 'react-use';
import { mergeSettings } from '../../utils/settingsUtils';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const SectionContent = ({ blocks, updateBlocks, settings }) => {
  const mergedSettings = mergeSettings(settings);

  const { previewMode } = useContext(PreviewModeContext);
  const [isDragging, setIsDragging] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');
  const [ref, { width }] = useMeasure();

  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
  const cols = { lg: 24, md: 24, sm: 8, xs: 8, xxs: 3 };
  const rowHeights = { lg: 50, md: 40, sm: 30, xs: 20, xxs: 10 };
  const marginSizes = {
    'extra-large': { lg: [20, 20], md: [16, 16], sm: [12, 12], xs: [8, 8], xxs: [4, 4] },
    'large': { lg: [16, 16], md: [12, 12], sm: [8, 8], xs: [6, 6], xxs: [3, 3] },
    'medium': { lg: [12, 12], md: [8, 8], sm: [6, 6], xs: [4, 4], xxs: [2, 2] },
    'small': { lg: [8, 8], md: [6, 6], sm: [4, 4], xs: [2, 2], xxs: [1, 1] },
    'extra-small': { lg: [4, 4], md: [3, 3], sm: [2, 2], xs: [1, 1], xxs: [0, 0] },
    'none': { lg: [0, 0], md: [0, 0], sm: [0, 0], xs: [0, 0], xxs: [0, 0] },
  };
  const margins = marginSizes[mergedSettings.margins];
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

  const [overlayMaxRows, setOverlayMaxRows] = useState(maxRows);

  useEffect(() => {
    const minHeight = rowHeights[currentBreakpoint];
    const containerElement = ref.current;
    if (containerElement) {
      containerElement.style.minHeight = `${minHeight}px`;
    }
  }, [currentBreakpoint, rowHeights, ref]);

  const handleLayoutChange = (currentLayout, allLayouts) => {
    if (!previewMode) {
      const updatedBlocks = updateBlockLayout(blocks, currentLayout);
      updateBlocks(updatedBlocks);
    }
  };

  const handleDrag = (layout, oldItem, newItem, placeholder) => {
    const totalRows = Math.max(placeholder.y + placeholder.h, 1);
    if (totalRows !== overlayMaxRows) {
      setOverlayMaxRows(totalRows);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragStop = () => {
    setIsDragging(false);
    setOverlayMaxRows(Math.max(maxRows, 1));
  };

  const handleResize = (layout, oldItem, newItem, placeholder) => {
    const totalRows = Math.max(placeholder.y + placeholder.h, 1);
    if (totalRows !== overlayMaxRows) {
      setOverlayMaxRows(totalRows);
    }
  };

  const handleResizeStop = () => {
    setIsDragging(false);
    setOverlayMaxRows(Math.max(maxRows, 1));
  };

  const updateBlockContent = (blockId, newContent) => {
    const updatedBlocks = blocks.map(block =>
      block.id === blockId ? { ...block, content: newContent } : block
    );
    updateBlocks(updatedBlocks);
  };

  return (
    <div className="relative w-full" ref={ref} style={{ minHeight: `${rowHeights[currentBreakpoint]}px` }}>
      {isDragging && !previewMode && width > 0 && (
        <GridOverlay
          cols={cols[currentBreakpoint]}
          margin={margins[currentBreakpoint]}
          containerPadding={containerPadding}
          containerWidth={width}
          rowHeight={rowHeights[currentBreakpoint]}
          maxRows={Math.max(overlayMaxRows, 1)}
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
        onDrag={handleDrag}
        onDragStop={handleDragStop}
        onResizeStart={handleDragStart}
        onResize={handleResize}
        onResizeStop={handleResizeStop}
      >
        {blocks.map((block) => (
          <div key={block.id} className="h-full w-full">
            <Block
              block={block}
              updateBlockContent={(newContent) => updateBlockContent(block.id, newContent)}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default SectionContent;