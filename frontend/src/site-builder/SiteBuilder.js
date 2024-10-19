import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionContainer from './components/Section/SectionContainer';
import { PreviewModeContext } from './PreviewModeContext';
import defaultSettings from './defaultSettings';
import ThemeSettings from './components/Theme/ThemeSettings';
import { defaultTheme } from './components/Theme/themeManagement';

const SiteBuilder = () => {
  const [sections, setSections] = useState([]);
  const [openToolbarId, setOpenToolbarId] = useState(null);
  const { setPreviewMode } = useContext(PreviewModeContext);
  const navigate = useNavigate();
  const newSectionRef = useRef(null);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);

  useEffect(() => {
    // Automatically add an empty section if there are no sections
    if (sections.length === 0) {
      addSection();
    }
  }, []);

  const handlePreview = () => {
    setPreviewMode(true);
    navigate('/preview', { state: { sections } });
  };

  const createBlock = (type = 'text', content = '') => {
    return {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content,
      x: 0,
      y: 0,
    };
  };

  // To track opening and closing of block toolbar
  const handleBlockClick = (blockId) => {
    setOpenToolbarId(prevId => prevId === blockId ? null : blockId);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.block-container')) {
        setOpenToolbarId(null);
      }
    };
  
    document.addEventListener('click', handleOutsideClick);
  
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

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

  const duplicateSection = (sectionId) => {
    const sectionToDuplicate = sections.find(section => section.id === sectionId);
    if (sectionToDuplicate) {
      const newSection = {
        id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        blocks: sectionToDuplicate.blocks.map(block => ({
          ...block,
          id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        })),
        settings: { ...sectionToDuplicate.settings }
      };
      setSections(prevSections => [...prevSections, newSection]);
      newSectionRef.current = newSection.id;
    }
  };

  const deleteSection = (sectionId) => {
    setSections((prevSections) => prevSections.filter((section) => section.id !== sectionId));
  };

  const moveSection = (sectionId, direction) => {
    setSections((prevSections) => {
      const index = prevSections.findIndex((section) => section.id === sectionId);
      if (index === -1) return prevSections;

      const newSections = [...prevSections];
      const [removedSection] = newSections.splice(index, 1);
      
      if (direction === 'up' && index > 0) {
        newSections.splice(index - 1, 0, removedSection);
      } else if (direction === 'down' && index < prevSections.length - 1) {
        newSections.splice(index + 1, 0, removedSection);
      } else {
        newSections.splice(index, 0, removedSection);
      }

      return newSections;
    });
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
      <button className="btn btn-primary ml-2" onClick={handlePreview}>
        Preview Mode
      </button>
      <button className="btn btn-secondary ml-4" onClick={addSection}>
        Add Section
      </button>
      <button className="btn btn-outline ml-4" onClick={() => setIsThemeOpen(true)}>
          Theme Settings
        </button>

      <div id="preview-section">
        {sections.map((section, index) => (
          <SectionContainer
            key={section.id}
            sectionId={section.id}
            blocks={section.blocks}
            updateBlocks={(newBlocks) => updateBlocksInSection(section.id, newBlocks)}
            addBlock={(blockType) => addBlockToSection(section.id, blockType)}
            settings={section.settings}
            updateSettings={(newSettings) => updateSettingsInSection(section.id, newSettings)}
            onDuplicate={() => duplicateSection(section.id)}
            onDelete={() => deleteSection(section.id)}
            onMoveUp={() => moveSection(section.id, 'up')}
            onMoveDown={() => moveSection(section.id, 'down')}
            isFirst={index === 0}
            isLast={index === sections.length - 1}
            isDeletable={sections.length > 1}
            openToolbarId={openToolbarId}
            onBlockClick={handleBlockClick}
            theme={currentTheme}
          />
        ))}
      </div>
      <ThemeSettings
        isOpen={isThemeOpen}
        onClose={() => setIsThemeOpen(false)}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
      />
    </div>
  );
};

export default SiteBuilder;