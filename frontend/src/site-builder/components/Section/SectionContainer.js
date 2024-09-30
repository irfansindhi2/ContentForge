import React, { useContext, useState } from 'react';
import SectionContent from './SectionContent';
import { PreviewModeContext } from '../../PreviewModeContext';

const SectionContainer = ({ sectionId, blocks, updateBlocks }) => {
  const { previewMode } = useContext(PreviewModeContext);

  const addBlock = () => {
    const newBlock = {
      id: `${sectionId}-${blocks.length + 1}`,
      type: 'text',
      content: `Block ${blocks.length + 1} of Section ${sectionId}`,
      x: 0,
      y: Infinity, // Place the new block at the bottom
    };
    updateBlocks([...blocks, newBlock]);
  };

  return (
    <div className="relative w-full">
      {!previewMode && (
        <>
          <button className="btn btn-primary absolute top-2 left-2 z-10" onClick={addBlock}>
            Add Block
          </button>
        </>
      )}
      {/* Inner container for content */}
      <div className="relative bg-white">
        <SectionContent
          blocks={blocks}
          updateBlocks={updateBlocks}
        />
      </div>
    </div>
  );
};

export default SectionContainer;