export const generateLayout = (blocks) =>
    blocks.map((block) => ({
      i: block.id,
      x: block.x || 0,
      y: block.y || 0,
      w: block.colSpan || 2,
      h: block.rowSpan || 2,
    }));
  
  export const updateBlockLayout = (blocks, newLayout) =>
    blocks.map((block) => {
      const layoutItem = newLayout.find((item) => item.i === block.id);
      return layoutItem
        ? { ...block, x: layoutItem.x, y: layoutItem.y, colSpan: layoutItem.w, rowSpan: layoutItem.h }
        : block;
    });