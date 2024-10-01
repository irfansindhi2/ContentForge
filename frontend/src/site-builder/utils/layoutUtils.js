// Generates layouts for all breakpoints
export const generateResponsiveLayouts = (blocks, cols) => {
  const breakpoints = Object.keys(cols);
  const layouts = {};

  breakpoints.forEach((breakpoint) => {
    const colCount = cols[breakpoint];
    layouts[breakpoint] = blocks.map((block, index) => {
      // Adjust positions and sizes based on the number of columns at this breakpoint
      let w = Math.min(block.colSpan || 2, colCount);
      let x = (block.x || 0) % colCount;
      let y = block.y || 0;

      return {
        i: block.id,
        x,
        y,
        w,
        h: block.rowSpan || 2,
      };
    });
  });

  return layouts;
};

// Updates block positions and sizes based on the new layout
export const updateBlockLayout = (blocks, newLayout) =>
  blocks.map((block) => {
    const layoutItem = newLayout.find((item) => item.i === block.id);
    return layoutItem
      ? {
          ...block,
          x: layoutItem.x,
          y: layoutItem.y,
          colSpan: layoutItem.w,
          rowSpan: layoutItem.h,
        }
      : block;
  });