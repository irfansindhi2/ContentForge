import React from 'react';

const GridOverlay = ({ cols, margin, containerPadding }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10" style={{ margin: -1 }}>
      <div
        className="w-full h-full grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: `${margin[1]}px ${margin[0]}px`,
          padding: `${containerPadding[1]}px ${containerPadding[0]}px`,
          marginLeft: `-${margin[0] / 2}px`,
          marginRight: `-${margin[0] / 2}px`,
        }}
      >
        {Array.from({ length: cols }).map((_, index) => (
          <div
            key={index}
            className="h-full bg-blue-100 bg-opacity-60 border-r border-blue-300 border-opacity-20 last:border-r-0"
          />
        ))}
      </div>
    </div>
  );
};

export default GridOverlay;