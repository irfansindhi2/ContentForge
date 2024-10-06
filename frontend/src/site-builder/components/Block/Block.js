import React, { useCallback, useContext } from 'react';
import { PreviewModeContext } from '../../PreviewModeContext';
import CarouselBlock from './CarouselBlock';
import CardBlock from './CardBlock';
import TextBlock from './TextBlock';
import BlockToolbar from './BlockToolbar';

const Block = React.memo(({ 
  block, 
  updateBlockContent, 
  onDuplicate, 
  onDelete, 
  isToolbarOpen, 
  onBlockClick 
}) => {
  const { previewMode } = useContext(PreviewModeContext);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    onBlockClick(block.id);
  }, [onBlockClick, block.id]);

  const handleDuplicate = useCallback(() => {
    onDuplicate(block);
  }, [onDuplicate, block]);

  const handleDelete = useCallback(() => {
    onDelete(block.id);
  }, [onDelete, block.id]);

  return (
    <div
      className="relative w-full h-full"
      onClick={handleClick}
    >
      <BlockToolbar
        visible={isToolbarOpen && !previewMode}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
      />
      {block.type === 'carousel' && <CarouselBlock items={block.content} />}
      {block.type === 'card' && <CardBlock content={block.content} />}
      {block.type === 'text' && (
        <TextBlock
          content={block.content}
          updateContent={(newContent) => updateBlockContent(newContent)}
        />
      )}
    </div>
  );
});

export default Block;