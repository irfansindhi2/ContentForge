import React from 'react';
import { Z_INDEXES } from '../../utils/zIndexes';

const GridOverlay = ({
  cols,
  margin,
  containerPadding,
  containerWidth,
  rowHeight,
  maxRows,
  currentPosition,
}) => {
  const validMaxRows =
    Number.isFinite(maxRows) && maxRows > 0 ? Math.floor(maxRows) : 1;
  const columnWidth =
    (containerWidth - (cols - 1) * margin[0] - 2 * containerPadding[0]) / cols;
  const containerHeight =
    validMaxRows * rowHeight +
    (validMaxRows - 1) * margin[1] +
    2 * containerPadding[1];

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: Z_INDEXES.GRID_OVERLAY }}>
      <div
        className="w-full relative"
        style={{
          padding: `${containerPadding[1]}px ${containerPadding[0]}px`,
          height: `${containerHeight}px`,
        }}
      >
        {/* Grid Cells */}
        <div className="relative" style={{ width: '100%', height: '100%' }}>
          {Array.from({ length: validMaxRows }).map((_, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="flex"
              style={{
                marginBottom:
                  rowIndex < validMaxRows - 1 ? `${margin[1]}px` : 0,
              }}
            >
              {Array.from({ length: cols }).map((_, colIndex) => (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={`border border-blue-500 border-opacity-50 ${
                    currentPosition &&
                    currentPosition.x === colIndex &&
                    currentPosition.y === rowIndex
                  }`}
                  style={{
                    width: `${columnWidth}px`,
                    height: `${rowHeight}px`,
                    marginRight: colIndex < cols - 1 ? `${margin[0]}px` : 0,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GridOverlay;