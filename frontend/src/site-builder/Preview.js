import React from 'react';
import { useLocation } from 'react-router-dom';
import SectionContainer from './components/Section/SectionContainer';  // Adjust the import path as needed

const Preview = () => {
  const location = useLocation();
  const { sections } = location.state || { sections: [] }; // Get sections from the navigate state

  return (
    <div className="p-4">
      {/* Render all sections in preview mode */}
      {sections.map((section) => (
        <SectionContainer
          key={section.id}
          sectionId={section.id}
          blocks={section.blocks}
          previewMode={true}  // Preview mode (no buttons)
        />
      ))}
    </div>
  );
};

export default Preview;
