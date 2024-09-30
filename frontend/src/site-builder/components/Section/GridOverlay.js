import React from 'react';

const GridOverlay = ({ columns, gap }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <div 
        className={`w-full h-full grid`}
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: `${gap}px`,
        }}
      >
        {Array.from({ length: columns }).map((_, index) => (
          <div 
            key={index} 
            className="h-full bg-blue-100 bg-opacity-10 border-r border-blue-200 border-opacity-60 last:border-r-0"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default GridOverlay;