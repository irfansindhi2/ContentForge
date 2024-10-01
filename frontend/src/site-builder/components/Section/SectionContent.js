import React, { useContext, useState, useMemo } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { PreviewModeContext } from '../../PreviewModeContext';
import Block from '../Block/Block';
import GridOverlay from './GridOverlay';
import { generateLayout, updateBlockLayout } from '../../utils/layoutUtils';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const SectionContent = ({ blocks, updateBlocks }) => {
  const { previewMode } = useContext(PreviewModeContext);
  const [isDragging, setIsDragging] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');

  const layout = useMemo(() => generateLayout(blocks), [blocks]);

  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
  const cols = { lg: 24, md: 18, sm: 12, xs: 6, xxs: 3 };
  const rowHeights = { lg: 50, md: 40, sm: 30, xs: 20, xxs: 10 };
  const margins = { lg: [10, 10], md: [8, 8], sm: [6, 6], xs: [4, 4], xxs: [2, 2] };
  const containerPadding = [0, 0];

  const handleLayoutChange = (newLayout) => {
    if (!previewMode) {
      const updatedBlocks = updateBlockLayout(blocks, newLayout);
      updateBlocks(updatedBlocks);
    }
  };

  return (
    <div className="relative w-full">
      {isDragging && !previewMode && (
        <GridOverlay 
          cols={cols[currentBreakpoint]}
          margin={margins[currentBreakpoint]}
          containerPadding={containerPadding}
        />
      )}
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
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
        onDragStart={() => setIsDragging(true)}
        onDragStop={() => setIsDragging(false)}
        onResizeStart={() => setIsDragging(true)}
        onResizeStop={() => setIsDragging(false)}
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