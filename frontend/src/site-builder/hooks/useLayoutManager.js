import { useState, useMemo } from 'react';
import { generateResponsiveLayouts } from '../utils/layoutUtils';

export const useLayoutManager = (blocks, cols) => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');
  const layouts = useMemo(() => generateResponsiveLayouts(blocks, cols), [blocks, cols]);

  const maxRows = useMemo(() => {
    if (!layouts[currentBreakpoint] || layouts[currentBreakpoint].length === 0) {
      return 1;
    }
    const max = layouts[currentBreakpoint].reduce((max, item) => {
      const total = (item.y || 0) + (item.h || 0);
      return Math.max(max, total);
    }, 0);
    return Math.max(Math.floor(max), 1);
  }, [layouts, currentBreakpoint]);

  return {
    currentBreakpoint,
    setCurrentBreakpoint,
    layouts,
    maxRows,
  };
};