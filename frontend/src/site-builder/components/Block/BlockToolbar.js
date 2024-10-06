import React from 'react';
import { Copy, Trash2 } from 'lucide-react';

const BlockToolbar = ({ onDuplicate, onDelete, visible }) => {
  if (!visible) return null;

  const handleToolbarClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="absolute -top-2 left-0 transform -translate-y-full flex space-x-2 bg-base-100 shadow-lg rounded-lg p-2 z-50"
      onClick={handleToolbarClick}
    >
      <button
        className="btn btn-sm btn-ghost"
        onClick={(e) => {
          e.stopPropagation();
          onDuplicate();
        }}
        title="Duplicate"
      >
        <Copy className="w-4 h-4" />
      </button>
      <button
        className="btn btn-sm btn-ghost btn-error"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default BlockToolbar;