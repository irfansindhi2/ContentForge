import React from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import SectionContainer from './components/Section/SectionContainer';  // Adjust the import path as needed

const Preview = () => {
  const location = useLocation();
  const { sections } = location.state || { sections: [] }; // Get sections from the navigate state

  return (
    <Box>
      {/* Render all sections in preview mode */}
      {sections.map((section) => (
        <SectionContainer
          key={section.id}
          sectionId={section.id}
          blocks={section.blocks}
          previewMode={true}  // Preview mode (no buttons)
        />
      ))}
    </Box>
  );
};

export default Preview;
