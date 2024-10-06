import { useState } from 'react';

export const useDragResize = (initialMaxRows) => {
  const [isDragging, setIsDragging] = useState(false);
  const [overlayMaxRows, setOverlayMaxRows] = useState(initialMaxRows);

  const handleDragStart = () => setIsDragging(true);
  const handleDragStop = () => {
    setIsDragging(false);
    setOverlayMaxRows(initialMaxRows);
  };

  const handleDrag = (layout, oldItem, newItem, placeholder) => {
    const totalRows = Math.max(placeholder.y + placeholder.h, 1);
    if (totalRows !== overlayMaxRows) {
      setOverlayMaxRows(totalRows);
    }
  };

  return {
    isDragging,
    overlayMaxRows,
    handleDragStart,
    handleDragStop,
    handleDrag,
  };
};