// SiteBuilder.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionContainer from './components/Section/SectionContainer';
import { PreviewModeContext } from './PreviewModeContext';

const SiteBuilder = () => {
  const [sections, setSections] = useState([
    { id: 1, blocks: [{ id: '1-1', type: 'text', content: 'Block 1 of Section 1' }] },
  ]);

  const { setPreviewMode } = useContext(PreviewModeContext);
  const navigate = useNavigate();

  // Open the preview
  const handlePreview = () => {
    setPreviewMode(true); // Enable preview mode
    navigate('/preview', { state: { sections } });
  };

  // Add a new section with an initial block
  const addSection = () => {
    const newSectionId = sections.length + 1;
    setSections([
      ...sections,
      {
        id: newSectionId,
        blocks: [
          {
            id: `${newSectionId}-1`,
            type: 'text', // Default block type
            content: `Block 1 of Section ${newSectionId}`,
          },
        ],
      },
    ]);
  };

  // Update blocks for a specific section
  const updateBlocksInSection = (sectionId, newBlocks) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId ? { ...section, blocks: newBlocks } : section
      )
    );
  };

  return (
    <div className="p-4">
      <button className="btn btn-primary" onClick={handlePreview}>
        Preview Mode
      </button>
      <button className="btn btn-secondary ml-4" onClick={addSection}>
        Add Section
      </button>

      <div id="preview-section" className="mt-4">
        {sections.map((section) => (
          <SectionContainer
            key={section.id}
            sectionId={section.id}
            blocks={section.blocks}
            updateBlocks={(newBlocks) => updateBlocksInSection(section.id, newBlocks)}
          />
        ))}
      </div>
    </div>
  );
};

export default SiteBuilder;
