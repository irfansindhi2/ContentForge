import React from 'react';

const GridOverlay = ({ cols, margin, containerPadding, containerWidth }) => {
  const columnWidth = (containerWidth - (cols - 1) * margin[0] - 2 * containerPadding[0]) / cols;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <div
        className="w-full h-full flex"
        style={{
          padding: `${containerPadding[1]}px ${containerPadding[0]}px`,
        }}
      >
        {Array.from({ length: cols }).map((_, index) => (
          <div
            key={index}
            className="h-full bg-blue-100 bg-opacity-60 border-r border-blue-300 border-opacity-20 last:border-r-0"
            style={{
              width: `${columnWidth}px`,
              marginRight: index < cols - 1 ? `${margin[0]}px` : 0,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default GridOverlay;