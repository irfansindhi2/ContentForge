import React, { useContext, useCallback } from 'react';
import { PreviewModeContext } from '../../PreviewModeContext';
import GridOverlay from './GridOverlay';
import { useMeasure } from 'react-use';
import { mergeSettings } from '../../utils/settingsUtils';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useLayoutManager } from '../../hooks/useLayoutManager';
import { useDragResize } from '../../hooks/useDragResize';
import { useBlockManager } from '../../hooks/useBlockManager';
import ResponsiveGrid from './ResponsiveGrid';

const SectionContent = ({ blocks, updateBlocks, settings, openToolbarId, onBlockClick }) => {
  const mergedSettings = mergeSettings(settings);
  const { previewMode } = useContext(PreviewModeContext);
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

  const { currentBreakpoint, setCurrentBreakpoint, layouts, maxRows } = useLayoutManager(blocks, cols);
  const { isDragging, overlayMaxRows, currentPosition, handleDragStart, handleDragStop, handleDrag } = useDragResize(maxRows);
  const { updateBlockContent, handleDuplicateBlock, handleDeleteBlock } = useBlockManager(blocks, updateBlocks);

  const handleLayoutChange = (currentLayout, allLayouts) => {
    if (!previewMode) {
      const updatedBlocks = blocks.map(block => {
        const layoutItem = currentLayout.find(item => item.i === block.id);
        if (layoutItem) {
          return {
            ...block,
            x: layoutItem.x,
            y: layoutItem.y,
            w: layoutItem.w,
            h: layoutItem.h,
          };
        }
        return block;
      });
      updateBlocks(updatedBlocks);
    }
  };

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

      // Update the block's 'h' and 'minH' value
      const updatedBlocks = blocks.map((block) => {
        if (block.id === blockId) {
          return {
            ...block,
            h: newH,
            minH: newH,
          };
        }
        return block;
      });
      updateBlocks(updatedBlocks);
    },
    [blocks, currentBreakpoint, margins, rowHeights, updateBlocks]
  );

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
          currentPosition={currentPosition}
        />
      )}
      <ResponsiveGrid
        blocks={blocks}
        layouts={layouts}
        breakpoints={breakpoints}
        cols={cols}
        rowHeights={rowHeights}
        margins={margins}
        containerPadding={containerPadding}
        currentBreakpoint={currentBreakpoint}
        previewMode={previewMode}
        onLayoutChange={handleLayoutChange}
        onBreakpointChange={setCurrentBreakpoint}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragStop={handleDragStop}
        onResize={handleDrag}
        onResizeStop={handleDragStop}
        updateBlockContent={updateBlockContent}
        handleDuplicateBlock={handleDuplicateBlock}
        handleDeleteBlock={handleDeleteBlock}
        openToolbarId={openToolbarId}
        onBlockClick={onBlockClick}
        onHeightChange={handleBlockHeightChange}
      />
    </div>
  );
};

export default SectionContent;