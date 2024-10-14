import { useState, useCallback } from 'react';

export const useDragResize = (initialMaxRows) => {
  const [isDragging, setIsDragging] = useState(false);
  const [overlayMaxRows, setOverlayMaxRows] = useState(initialMaxRows);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [initialPosition, setInitialPosition] = useState(null);
  const dragThreshold = 10; // Set your desired pixel threshold here

  const handleDragStart = useCallback((layout, oldItem, newItem, placeholder, e, element) => {
    setOverlayMaxRows(initialMaxRows);
    // Store the initial mouse position
    setInitialPosition({ x: e.clientX, y: e.clientY });
  }, [initialMaxRows]);

  const handleDragStop = useCallback(() => {
    setIsDragging(false);
    setOverlayMaxRows(initialMaxRows);
    setCurrentPosition(null);
    setInitialPosition(null);
  }, [initialMaxRows]);

  const handleDrag = useCallback((layout, oldItem, newItem, placeholder, e, element) => {
    if (initialPosition) {
      const deltaX = e.clientX - initialPosition.x;
      const deltaY = e.clientY - initialPosition.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance >= dragThreshold) {
        // Start dragging after exceeding the threshold
        setIsDragging(true);
        setCurrentPosition({ x: newItem.x, y: newItem.y });
        const totalRows = Math.max(placeholder.y + placeholder.h, 1);
        setOverlayMaxRows(totalRows);
      }
    }
  }, [initialPosition, dragThreshold]);

  return {
    isDragging,
    overlayMaxRows,
    currentPosition,
    handleDragStart,
    handleDragStop,
    handleDrag,
  };
};
