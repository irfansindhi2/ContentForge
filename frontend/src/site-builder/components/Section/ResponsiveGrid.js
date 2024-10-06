import React from 'react';
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
}) => {
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
      onLayoutChange={onLayoutChange}
      isDraggable={!previewMode}
      isResizable={!previewMode}
      resizeHandles={["s", "w", "e", "n", "sw", "se", "nw", "ne"]}
      compactType={null}
      preventCollision
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
            className={`h-full w-full ${!previewMode ? 'hover:outline hover:outline-2 hover:outline-blue-500' : ''}`}
            data-grid={{
              x: Number(block.x) || config.defaultX,
              y: Number(block.y) || config.defaultY,
              w: Number(block.w) || config.defaultW,
              h: Number(block.h) || config.defaultH,
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
            />
          </div>
        );
      })}
    </ResponsiveGridLayout>
  );
};

export default ResponsiveGrid;