import React, { useContext, useState, useMemo } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { PreviewModeContext } from '../../PreviewModeContext';
import Block from '../Block/Block';
import GridOverlay from './GridOverlay';
import { generateLayout, updateBlockLayout } from '../../utils/layoutUtils';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const SectionContent = ({ blocks, updateBlocks, columns = 24, rowHeight = 50, gap = 2 }) => {
  const { previewMode } = useContext(PreviewModeContext);
  const [isDragging, setIsDragging] = useState(false);

  const layout = useMemo(() => generateLayout(blocks), [blocks]);

  const handleLayoutChange = (newLayout) => {
    if (!previewMode) {
      const updatedBlocks = updateBlockLayout(blocks, newLayout);
      updateBlocks(updatedBlocks);
    }
  };

  return (
    <div className="relative w-full">
      {isDragging && !previewMode && <GridOverlay columns={columns} />}
      <ResponsiveGridLayout
        className={`layout gap-${gap}`}
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