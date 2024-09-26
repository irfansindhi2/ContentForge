import React from 'react';
import SectionContent from './SectionContent';

const SectionContainer = ({ sectionId, blocks, updateBlocks, previewMode }) => {
  // Function to add a new block to the section
  const addBlock = () => {
    const newBlock = { id: `${sectionId}-${blocks.length + 1}`, content: `Block ${blocks.length + 1} of Section ${sectionId}` };
    updateBlocks(sectionId, [...blocks, newBlock]);
  };

  return (
    <div
      className={`relative p-4 border ${
        !previewMode ? 'hover:border-blue-500 border-transparent' : 'border-transparent'
      }`}
    >
      {/* Only show the Add Block button in edit mode */}
      {!previewMode && (
        <button
          className="btn btn-accent absolute top-2 left-2"
          onClick={addBlock}
        >
          Add Block
        </button>
      )}

      {/* Render blocks */}
      <SectionContent blocks={blocks} />
    </div>
  );
};

export default SectionContainer;