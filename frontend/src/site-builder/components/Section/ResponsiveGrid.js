import React, { useState, useCallback } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import Block from '../Block/Block';
import { getBlockConfig } from '../../utils/blockConfig';

const ResponsiveGridLayout = WidthProvider(Responsive);

const ResponsiveGrid = ({
  blocks,
  layouts,
  breakpoints,
  cols,
  rowHeights,
  margins,
  containerPadding,
  currentBreakpoint,
  previewMode,
  onLayoutChange,
  onBreakpointChange,
  onDragStart,
  onDrag,
  onDragStop,
  onResize,
  onResizeStop,
  updateBlockContent,
  handleDuplicateBlock,
  handleDeleteBlock,
  openToolbarId,
  onBlockClick,
  onHeightChange
}) => {
  const [blockHeights, setBlockHeights] = useState({});

  const handleBlockHeightChange = useCallback(
    (blockId, newHeightInPixels) => {
      const rowHeight = rowHeights[currentBreakpoint];
      const marginY = margins[currentBreakpoint][1];
      const containerPaddingY = containerPadding[1];
      const totalRowHeight = rowHeight + marginY;

      let newH = Math.ceil(
        (newHeightInPixels + marginY + containerPaddingY) / totalRowHeight
      );
      if (newH < 1) newH = 1;

      setBlockHeights((prev) => ({ ...prev, [blockId]: newH }));
    },
    [currentBreakpoint, margins, rowHeights, containerPadding]
  );

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      breakpoints={breakpoints}
      cols={cols}
      rowHeight={rowHeights[currentBreakpoint]}
      margin={margins[currentBreakpoint]}
      containerPadding={containerPadding}
      onBreakpointChange={onBreakpointChange}
      onLayoutChange={(currentLayout, allLayouts) => {
        const updatedLayouts = { ...allLayouts };
        Object.keys(blockHeights).forEach(blockId => {
          Object.keys(updatedLayouts).forEach(breakpoint => {
            const layout = updatedLayouts[breakpoint];
            const blockIndex = layout.findIndex(item => item.i === blockId);
            if (blockIndex !== -1) {
              layout[blockIndex] = { ...layout[blockIndex], h: blockHeights[blockId] };
            }
          });
        });
        onLayoutChange(currentLayout, updatedLayouts);
      }}
      isDraggable={!previewMode}
      isResizable={!previewMode}
      resizeHandles={["s", "w", "e", "n", "sw", "se", "nw", "ne"]}
      compactType={null}
      preventCollision
      allowOverlap={blocks.length > 1 && blocks.some(block => block.type === 'text')} // Enable overlap only if a TextBlock is present
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragStop={onDragStop}
      onResizeStart={onDragStart}
      onResize={onResize}
      onResizeStop={onResizeStop}
    >
      {blocks.map((block) => {
        const config = getBlockConfig(block.type);
        return (
          <div
            key={block.id}
            className={`w-full ${!previewMode
                ? 'hover:outline hover:outline-2 hover:outline-blue-500 focus-within:outline focus-within:outline-2 focus-within:outline-blue-500'
                : ''
              }`}
            data-grid={{
              x: Number(block.x) || config.defaultX,
              y: Number(block.y) || config.defaultY,
              w: Number(block.w) || config.defaultW,
              h: blockHeights[block.id] || Number(block.h) || config.defaultH,
              minW: config.minW,
              minH: config.minH,
            }}
          >
            <Block
              block={block}
              updateBlockContent={(newContent) => updateBlockContent(block.id, newContent)}
              onDuplicate={handleDuplicateBlock}
              onDelete={handleDeleteBlock}
              isToolbarOpen={openToolbarId === block.id}
              onBlockClick={() => onBlockClick(block.id)}
              onHeightChange={(newHeight) => handleBlockHeightChange(block.id, newHeight)}
            />
          </div>
        );
      })}
    </ResponsiveGridLayout>
  );
};

export default ResponsiveGrid;