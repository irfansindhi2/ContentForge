import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionContainer from './components/Section/SectionContainer';
import { PreviewModeContext } from './PreviewModeContext';

const SiteBuilder = () => {
  const [sections, setSections] = useState([]);
  const { setPreviewMode } = useContext(PreviewModeContext);
  const navigate = useNavigate();

  const handlePreview = () => {
    setPreviewMode(true);
    navigate('/preview', { state: { sections } });
  };

  const createBlock = (type = 'text', content = '') => ({
    id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    content,
  });

  const addSection = () => {
    const newSection = {
      id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      blocks: [createBlock()],
    };
    setSections([...sections, newSection]);
  };

  const addBlockToSection = (sectionId, blockType = 'text') => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? { ...section, blocks: [...section.blocks, createBlock(blockType)] }
          : section
      )
    );
  };

  const updateBlocksInSection = (sectionId, newBlocks) => {
    setSections(prevSections =>
      prevSections.map(section =>
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
            addBlock={(blockType) => addBlockToSection(section.id, blockType)}
          />
        ))}
      </div>
    </div>
  );
};

export default SiteBuilder;