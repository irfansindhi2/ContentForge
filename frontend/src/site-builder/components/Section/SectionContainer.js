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
      x: 0,
      y: Infinity, // This will place the new block at the bottom
      w: 2, // Default width of 2 columns
      h: 2, // Default height of 2 rows
    };
    updateBlocks([...blocks, newBlock]);
  };

  return (
    <div className={`relative w-full p-4 border ${
      !previewMode ? 'hover:border-blue-500 border-transparent' : 'border-transparent'
    }`}>
      {!previewMode && (
        <button className="btn btn-primary absolute top-2 left-2 z-10" onClick={addBlock}>
          Add Block
        </button>
      )}
      <SectionContent blocks={blocks} updateBlocks={updateBlocks} />
    </div>
  );
};

export default SectionContainer;