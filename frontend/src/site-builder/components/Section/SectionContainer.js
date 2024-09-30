import React, { useContext, useState } from 'react';
import SectionContent from './SectionContent';
import { PreviewModeContext } from '../../PreviewModeContext';

const SectionContainer = ({ sectionId, blocks, updateBlocks }) => {
  const { previewMode } = useContext(PreviewModeContext);
  const [padding, setPadding] = useState(4); // Default padding is 4
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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

  // Increase padding
  const increasePadding = () => setPadding((prev) => Math.min(prev + 1, 10));
  
  // Decrease padding
  const decreasePadding = () => setPadding((prev) => Math.max(prev - 1, 0));

  return (
    <div className="relative w-full">
      {!previewMode && (
        <>
          <button className="btn btn-primary absolute top-2 left-2 z-10" onClick={addBlock}>
            Add Block
          </button>
          <div className="absolute top-2 right-2 z-10 flex">
            <button className="btn btn-secondary mr-2" onClick={decreasePadding}>
              -
            </button>
            <button className="btn btn-secondary" onClick={increasePadding}>
              +
            </button>
          </div>
        </>
      )}

      {/* Grid container with adjustable padding */}
      <div
        className={`relative border ${
          !previewMode ? 'hover:border-blue-500 border-transparent' : 'border-transparent'
        }`}
        style={{
          padding: `${padding}rem`,
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Stripe Background Only on Padding Area */}
        <div
          className={`absolute inset-0 pointer-events-none ${
            (isHovering || isDragging) && !previewMode ? '' : 'hidden'
          }`}
          style={{
            padding: `${padding}rem`,
            background:
              `repeating-linear-gradient(
                135deg,
                transparent,
                transparent 2px,
                rgba(0, 0, 0, 0.05) 2px,
                rgba(0, 0, 0, 0.05) 4px
              )`,
            zIndex: 1,
          }}
        />

        {/* Section Content */}
        <div className="relative z-10">
          <SectionContent
            blocks={blocks}
            updateBlocks={updateBlocks}
            setIsDragging={setIsDragging}
          />
        </div>
      </div>
    </div>
  );
};

export default SectionContainer;