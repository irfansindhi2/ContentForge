import React, { useContext } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { PreviewModeContext } from '../../PreviewModeContext';
import Block from '../Block/Block';

const DraggableBlock = ({ block, isPreview = false }) => {
  const { previewMode } = useContext(PreviewModeContext);

  const { attributes, listeners, setNodeRef, transform, transition } = useDraggable({
    id: block.id,
    disabled: previewMode || isPreview,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: (previewMode || isPreview) ? 1 : transform ? 0.5 : 1,
  };

  const dragClasses = (previewMode || isPreview) ? '' : 'cursor-move';

  if (previewMode || isPreview) {
    return <Block block={block} />;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Block block={block} className={dragClasses} />
    </div>
  );
};

export default DraggableBlock;