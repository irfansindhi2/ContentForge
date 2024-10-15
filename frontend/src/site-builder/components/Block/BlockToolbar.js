import { React, useState, useEffect } from 'react';
import { usePopper } from 'react-popper';
import { Copy, Trash2 } from 'lucide-react';
import { Z_INDEXES } from '../../utils/zIndexes';
import EditButton from './EditButton';
import TiptapToolbar from './TiptapToolbar';

const BlockToolbar = ({
  onDuplicate,
  onDelete,
  onEdit,
  visible,
  blockType,
  isEditing,
  editor,
  blockRef,
  blockPosition,
 }) => {
  if (!visible) return null;

  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);

  // Initialize Popper with desired options
  const { styles, attributes, update } = usePopper(referenceElement, popperElement, {
    placement: 'top-start',
    modifiers: [
      {
        name: 'preventOverflow',
        options: {
          boundary: 'viewport',
          tether: false, // Disable tether to prevent unwanted repositioning
          padding: 8, // Adjust as needed
        },
      },
      {
        name: 'flip',
        options: {
          fallbackPlacements: ['bottom-start', 'top-end', 'bottom-end'],
        },
      },
    ],
  });

  useEffect(() => {
    // Set the reference element to the block's DOM node
    setReferenceElement(blockRef.current);
  }, [blockRef]);

  useEffect(() => {
    if (update) {
      update();
    }
  }, [blockPosition, update]);

  const handleToolbarClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      ref={setPopperElement}
      className="flex space-x-2 bg-base-100 shadow-lg rounded-lg p-2"
      onClick={handleToolbarClick}
      style={{ zIndex: Z_INDEXES.BLOCK_TOOLBAR, ...styles.popper }} // Apply Popper styles
      {...attributes.popper}
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