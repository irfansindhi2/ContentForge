import React from 'react';
import { Copy, Trash2 } from 'lucide-react';
import { Z_INDEXES } from '../../utils/zIndexes';
import EditButton from './EditButton';
import TiptapToolbar from './TiptapToolbar';

const BlockToolbar = ({ onDuplicate, onDelete, onEdit, visible, blockType, isEditing, editor }) => {
  if (!visible) return null;

  const handleToolbarClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="absolute -top-2 left-0 transform -translate-y-full flex space-x-2 bg-base-100 shadow-lg rounded-lg p-2"
      onClick={handleToolbarClick}
      style={{ zIndex: Z_INDEXES.BLOCK_TOOLBAR }}
    >
      {isEditing && blockType === 'text' ? (
        <TiptapToolbar editor={editor} />
      ) : (
        <>
          <EditButton onClick={onEdit} blockType={blockType} />
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
        </>
      )}
    </div>
  );
};

export default BlockToolbar;