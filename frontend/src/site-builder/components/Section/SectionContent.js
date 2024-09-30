import React, { useContext, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { PreviewModeContext } from '../../PreviewModeContext';
import Block from '../Block/Block';
import GridOverlay from './GridOverlay';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const SectionContent = ({ blocks, updateBlocks, columns = 24, rowHeight = 50, gap = 2 }) => {
  const { previewMode } = useContext(PreviewModeContext);
  const [isDragging, setIsDragging] = useState(false);

  const layout = blocks.map(block => ({
    i: block.id,
    x: block.x || 0,
    y: block.y || 0,
    w: block.colSpan || 2,
    h: block.rowSpan || 2,
  }));

  const handleLayoutChange = (newLayout) => {
    if (!previewMode) {
      const updatedBlocks = blocks.map(block => {
        const layoutItem = newLayout.find(item => item.i === block.id);
        return layoutItem
          ? { ...block, x: layoutItem.x, y: layoutItem.y, colSpan: layoutItem.w, rowSpan: layoutItem.h }
          : block;
      });
      updateBlocks(updatedBlocks);
    }
  };

  return (
    <div className="relative w-full">
      {isDragging && !previewMode && (
        <GridOverlay columns={columns} />
      )}
      <ResponsiveGridLayout
        className={`layout ${gap === 2 ? 'gap-2' : 'gap-4'}`}
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: columns, md: columns, sm: columns, xs: columns, xxs: columns }}
        rowHeight={rowHeight}
        onLayoutChange={handleLayoutChange}
        isDraggable={!previewMode}
        isResizable={!previewMode}
        compactType={null}
        preventCollision
        margin={[0, 0]}
        containerPadding={[0, 0]}
        onDragStart={() => setIsDragging(true)}
        onDragStop={() => setIsDragging(false)}
        onResizeStart={() => setIsDragging(true)}
        onResizeStop={() => setIsDragging(false)}
      >
        {blocks.map(block => (
          <div key={block.id} className="bg-white shadow-lg rounded-md overflow-hidden">
            <Block block={block} />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default SectionContent;