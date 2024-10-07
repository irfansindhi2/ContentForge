import React, { useCallback, useContext, useState, useEffect } from 'react';
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
  onBlockClick ,
  onHeightChange
}) => {
  const { previewMode } = useContext(PreviewModeContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    if (!isToolbarOpen) {
      setIsEditing(false);
    }
  }, [isToolbarOpen]);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    if (!previewMode) {
      if (isToolbarOpen) {
        setIsEditing(true);
      } else {
        onBlockClick(block.id);
      }
    }
  }, [onBlockClick, block.id, isToolbarOpen, previewMode]);

  const handleDuplicate = useCallback(() => {
    onDuplicate(block);
  }, [onDuplicate, block]);

  const handleDelete = useCallback(() => {
    onDelete(block.id);
  }, [onDelete, block.id]);

  const handleEdit = useCallback(() => {
    setIsEditing(prev => !prev);
  }, []);

  const handleEditComplete = useCallback((newContent) => {
    updateBlockContent(newContent);
    setIsEditing(false);
  }, [updateBlockContent]);

  const handleHeightChange = useCallback(
    (newHeight) => {
      onHeightChange(block.id, newHeight);
    },
    [block.id, onHeightChange]
  );

  return (
    <div
      className={`relative w-full h-full ${isEditing ? 'editing' : ''}`}
      onClick={handleClick}
    >
      <BlockToolbar
        visible={isToolbarOpen && !previewMode}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onEdit={handleEdit}
        blockType={block.type}
        isEditing={isEditing}
        editor={editor}
      />
      {block.type === 'carousel' && (
        <CarouselBlock 
          items={block.content} 
          isEditing={isEditing}
          onEditComplete={handleEditComplete}
        />
      )}
      {block.type === 'card' && (
        <CardBlock 
          content={block.content} 
          isEditing={isEditing}
          onEditComplete={handleEditComplete}
        />
      )}
      {block.type === 'text' && (
        <TextBlock
          content={block.content}
          updateContent={updateBlockContent}
          isEditing={isEditing}
          onEditComplete={handleEditComplete}
          setEditor={setEditor}
          onHeightChange={handleHeightChange}
        />
      )}
    </div>
  );
});

export default Block;