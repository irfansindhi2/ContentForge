import React from 'react';

const GridOverlay = ({ columns }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <div 
        className={`w-full h-full grid gap-2`}
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: columns }).map((_, index) => (
          <div key={index} className="h-full bg-blue-200 bg-opacity-20"></div>
        ))}
      </div>
    </div>
  );
};

export default GridOverlay;