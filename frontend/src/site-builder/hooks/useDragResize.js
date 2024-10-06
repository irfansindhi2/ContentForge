import { useState, useCallback } from 'react';

export const useDragResize = (initialMaxRows) => {
  const [isDragging, setIsDragging] = useState(false);
  const [overlayMaxRows, setOverlayMaxRows] = useState(initialMaxRows);
  const [currentPosition, setCurrentPosition] = useState(null);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    setOverlayMaxRows(initialMaxRows);
  }, [initialMaxRows]);

  const handleDragStop = useCallback(() => {
    setIsDragging(false);
    setOverlayMaxRows(initialMaxRows);
    setCurrentPosition(null);
  }, [initialMaxRows]);

  const handleDrag = useCallback((layout, oldItem, newItem, placeholder) => {
    const totalRows = Math.max(placeholder.y + placeholder.h, 1);
    setOverlayMaxRows(totalRows);
    setCurrentPosition({ x: newItem.x, y: newItem.y });
  }, []);

  return {
    isDragging,
    overlayMaxRows,
    currentPosition,
    handleDragStart,
    handleDragStop,
    handleDrag,
  };
};