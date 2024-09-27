import React, { useContext } from 'react';
import SectionContent from './SectionContent';
import { PreviewModeContext } from '../../PreviewModeContext';

const SectionContainer = ({ sectionId, blocks, updateBlocks }) => {
  const { previewMode } = useContext(PreviewModeContext);

  const addBlock = () => {
    const newBlock = {
      id: `${sectionId}-${blocks.length + 1}`,
      type: 'text',
      content: `Block ${blocks.length + 1} of Section ${sectionId}`,
      x: 0, // Initial x position
      y: 0, // Initial y position
    };
    updateBlocks([...blocks, newBlock]);
  };

  return (
    <div className={`relative overflow-hidden w-full h-full p-4 border ${!previewMode ? 'hover:border-blue-500 border-transparent' : 'border-transparent'}`}>
      {!previewMode && (
        <button className="btn btn-primary absolute top-2 left-2 z-10" onClick={addBlock}>
          Add Block
        </button>
      )}
      {/* Render blocks */}
      <SectionContent blocks={blocks} updateBlocks={updateBlocks} />
    </div>
  );
};

export default SectionContainer;
