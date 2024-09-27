import { Modifier } from '@dnd-kit/core';

export const snapToGrid = (gridSize) => {
  const modifier: Modifier = ({ transform }) => {
    return {
      x: Math.round(transform.x / gridSize) * gridSize,
      y: Math.round(transform.y / gridSize) * gridSize,
    };
  };
  return modifier;
};

// You can add more modifiers here as needed.
