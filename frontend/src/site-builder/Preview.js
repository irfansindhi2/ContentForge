import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SectionContainer from './components/Section/SectionContainer';
import { PreviewModeContext } from './PreviewModeContext';
import defaultSettings from './defaultSettings';

const Preview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setPreviewMode } = useContext(PreviewModeContext);

  const { sections } = location.state || { sections: [] }; // Get sections from navigate state

  // Enable preview mode when component mounts and disable it when unmounts
  useEffect(() => {
    setPreviewMode(true);

    return () => {
      setPreviewMode(false);
    };
  }, [setPreviewMode]);

  // Redirect to builder if no sections are provided
  if (!sections.length) {
    navigate('/edit');
    return null;
  }

  // Ensure each section has settings
  const sectionsWithSettings = sections.map((section) => ({
    ...section,
    settings: section.settings || defaultSettings, // Provide default settings
  }));

  const handleBlockClick = () => {
    // Do nothing in preview mode
  };

  return (
    <div>
      {sectionsWithSettings.map((section) => (
        <SectionContainer
          key={section.id}
          sectionId={section.id}
          blocks={section.blocks}
          settings={section.settings}
          updateBlocks={() => {}} // No updates in preview mode
          onBlockClick={handleBlockClick}
          openToolbarId={null}
        />
      ))}
    </div>
  );
};

export default Preview;