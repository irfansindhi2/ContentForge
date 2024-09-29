export const snapToGrid = (gridSize) => ({ transform }) => {
  if (!transform) return transform;

  return {
    ...transform,
    x: Math.round(transform.x / gridSize) * gridSize,
    y: Math.round(transform.y / gridSize) * gridSize,
  };
};

export const restrictMovement = (containerRef) => ({ transform, activeNodeRect, draggingNodeRect }) => {
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

  // Prevent moving up, but allow moving down
  let y = transform.y;
  if (draggingNodeRect && draggingNodeRect.top !== null) {
    if (draggingNodeRect.top + transform.y < containerRect.top) {
      y = containerRect.top - draggingNodeRect.top;
    }
  } else {
    // If draggingNodeRect is not available, use activeNodeRect as a fallback
    if (activeNodeRect.top + transform.y < containerRect.top) {
      y = containerRect.top - activeNodeRect.top;
    }
  }

  return {
    ...transform,
    x,
    y,
  };
};