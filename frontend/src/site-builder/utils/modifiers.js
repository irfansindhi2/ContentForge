export const snapToGrid = (gridSize) => ({ transform }) => {
  if (!transform) return transform;

  return {
    ...transform,
    x: Math.round(transform.x / gridSize) * gridSize,
    y: Math.round(transform.y / gridSize) * gridSize,
  };
};

export const restrictHorizontalToParent = (containerRef) => ({ transform, activeNodeRect }) => {
  if (!activeNodeRect || !containerRef.current) {
    return transform;
  }

  const containerRect = containerRef.current.getBoundingClientRect();

  const minX = 0;
  const maxX = containerRect.width - activeNodeRect.width;

  let x = transform.x;
  if (activeNodeRect.left + transform.x < containerRect.left) {
    x = minX - (activeNodeRect.left - containerRect.left);
  } else if (activeNodeRect.left + activeNodeRect.width + transform.x > containerRect.left + containerRect.width) {
    x = maxX - (activeNodeRect.left - containerRect.left);
  }

  // Do not restrict Y movement
  return {
    ...transform,
    x,
  };
};