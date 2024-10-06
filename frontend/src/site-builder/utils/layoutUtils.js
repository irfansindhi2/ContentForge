import { getBlockConfig } from './blockConfig';

// Generates layouts for all breakpoints
export const generateResponsiveLayouts = (blocks, cols) => {
  const breakpoints = Object.keys(cols);
  const layouts = {};

  breakpoints.forEach((breakpoint) => {
    const colCount = cols[breakpoint];
    layouts[breakpoint] = blocks.map((block) => {
      const config = getBlockConfig(block.type);
      let w = Math.min(Number(block.w) || config.defaultW, colCount);
      let x = Number(block.x) || config.defaultX;
      let y = Number(block.y) || config.defaultY;
      let h = Number(block.h) || config.defaultH;

      return {
        i: block.id,
        x: x % colCount, // Ensure x is within the column range
        y: y,
        w: w,
        h: h,
        minW: config.minW,
        minH: config.minH,
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