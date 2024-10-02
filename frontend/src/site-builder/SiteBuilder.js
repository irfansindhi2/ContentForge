import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionContainer from './components/Section/SectionContainer';
import { PreviewModeContext } from './PreviewModeContext';
import defaultSettings from './defaultSettings';

const SiteBuilder = () => {
  const [sections, setSections] = useState([]);
  const { setPreviewMode } = useContext(PreviewModeContext);
  const navigate = useNavigate();
  const newSectionRef = useRef(null);

  const handlePreview = () => {
    setPreviewMode(true);
    navigate('/preview', { state: { sections } });
  };

  const createBlock = (type = 'text', content = '') => ({
    id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    content,
    x: 0, // Default x coordinate
    y: 0, // Default y coordinate
  });

  const addSection = () => {
    const newSection = {
      id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      blocks: [],
      settings: defaultSettings
    };
    setSections([...sections, newSection]);
  };

  const addBlockToSection = (sectionId, blockType = 'text') => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? { ...section, blocks: [...section.blocks, createBlock(blockType)] }
          : section
      )
    );
  };

  const updateBlocksInSection = (sectionId, newBlocks) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId ? { ...section, blocks: newBlocks } : section
      )
    );
  };

  const updateSettingsInSection = (sectionId, newSettings) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId ? { ...section, settings: newSettings } : section
      )
    );
  };

  const duplicateSection = (sectionId, blocks, settings) => {
    const newSection = {
      id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      blocks: blocks.map(block => ({
        ...block,
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      })),
      settings: { ...settings }
    };
    setSections(prevSections => [...prevSections, newSection]);
    newSectionRef.current = newSection.id;
  };

  useEffect(() => {
    if (newSectionRef.current) {
      const newSectionElement = document.getElementById(newSectionRef.current);
      if (newSectionElement) {
        newSectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      newSectionRef.current = null;
    }
  }, [sections]);

  return (
    <div>
      <button className="btn btn-primary" onClick={handlePreview}>
        Preview Mode
      </button>
      <button className="btn btn-secondary ml-4" onClick={addSection}>
        Add Section
      </button>

      <div id="preview-section">
        {sections.map((section) => (
          <SectionContainer
            key={section.id}
            sectionId={section.id}
            blocks={section.blocks}
            updateBlocks={(newBlocks) => updateBlocksInSection(section.id, newBlocks)}
            addBlock={(blockType) => addBlockToSection(section.id, blockType)}
            settings={section.settings}
            updateSettings={(newSettings) => updateSettingsInSection(section.id, newSettings)}
            onDuplicate={duplicateSection}
          />
        ))}
      </div>
    </div>
  );
};

export default SiteBuilder;