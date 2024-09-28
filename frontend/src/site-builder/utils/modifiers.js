export const snapToGrid = (gridSize) => ({ transform }) => {
  if (!transform) return transform;

  return {
    ...transform,
    x: Math.round(transform.x / gridSize) * gridSize,
    y: Math.round(transform.y / gridSize) * gridSize,
  };
};