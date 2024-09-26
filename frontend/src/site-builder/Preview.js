// Preview.js
import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SectionContainer from './components/Section/SectionContainer';
import { PreviewModeContext } from './PreviewModeContext';

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

  return (
    <div className="p-4">
      {sections.map((section) => (
        <SectionContainer
          key={section.id}
          sectionId={section.id}
          blocks={section.blocks}
          updateBlocks={() => {}} // No updates in preview mode
        />
      ))}
    </div>
  );
};

export default Preview;
