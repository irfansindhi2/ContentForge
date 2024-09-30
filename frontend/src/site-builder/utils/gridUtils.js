export const snapToGrid = (containerRect, columns, rowHeight) => ({ transform }) => {
  if (!transform) return transform;

  const columnWidth = containerRect.width / columns;
  
  return {
    ...transform,
    x: Math.round(transform.x / columnWidth) * columnWidth,
    y: Math.round(transform.y / rowHeight) * rowHeight,
  };
};

// Helper function to convert grid coordinates to pixels
export const gridToPixels = (x, y, containerRect, columns, rowHeight) => {
  const columnWidth = containerRect.width / columns;
  return {
    x: x * columnWidth,
    y: y * rowHeight,
  };
};

// Helper function to convert pixels to grid coordinates
export const pixelsToGrid = (x, y, containerRect, columns, rowHeight) => {
  const columnWidth = containerRect.width / columns;
  return {
    x: Math.round(x / columnWidth),
    y: Math.round(y / rowHeight),
  };
};