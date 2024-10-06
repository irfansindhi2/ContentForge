import { useState } from 'react';

export const useBlockManager = (initialBlocks, updateBlocks) => {
  const [openToolbarId, setOpenToolbarId] = useState(null);

  const updateBlockContent = (blockId, newContent) => {
    const updatedBlocks = initialBlocks.map(block =>
      block.id === blockId ? { ...block, content: newContent } : block
    );
    updateBlocks(updatedBlocks);
  };

  const handleBlockClick = (blockId) => {
    setOpenToolbarId(prevId => prevId === blockId ? null : blockId);
  };

  const handleDuplicateBlock = (blockToDuplicate) => {
    const newBlock = {
      ...blockToDuplicate,
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    updateBlocks([...initialBlocks, newBlock]);
  };

  const handleDeleteBlock = (blockId) => {
    const updatedBlocks = initialBlocks.filter(block => block.id !== blockId);
    updateBlocks(updatedBlocks);
  };

  return {
    openToolbarId,
    updateBlockContent,
    handleBlockClick,
    handleDuplicateBlock,
    handleDeleteBlock,
  };
};