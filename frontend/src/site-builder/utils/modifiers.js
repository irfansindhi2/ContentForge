export const snapToGrid = (gridSize) => ({ transform }) => {
  if (!transform) return transform;

  return {
    ...transform,
    x: Math.round(transform.x / gridSize) * gridSize,
    y: Math.round(transform.y / gridSize) * gridSize,
  };
};

export const restrictToGrid = ({ transform }) => {
  return {
    ...transform,
    x: Math.round(transform.x / 50) * 50,
    y: Math.round(transform.y / 50) * 50,
  };
};