import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import SectionContainer from './components/Section/SectionContainer';
import { useState } from 'react';

const SiteBuilder = () => {
  const [sections, setSections] = useState([{ id: 1, blocks: [{ id: '1-1', content: 'Block 1 of Section 1' }] }]);
  const navigate = useNavigate();

  // Open the preview
  const handlePreview = () => {
    navigate('/preview', { state: { sections } });
  };

  // Add a new section with an initial block
  const addSection = () => {
    const newSectionId = sections.length + 1;
    setSections([
      ...sections,
      { id: newSectionId, blocks: [{ id: `${newSectionId}-1`, content: `Block 1 of Section ${newSectionId}` }] },
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
    <Box sx={{ margin: 3 }}>
      <Button variant="contained" onClick={handlePreview}>
        Preview Mode
      </Button>
      <Button variant="contained" color="secondary" onClick={addSection} sx={{ marginLeft: 2 }}>
        Add Section
      </Button>

      <div id="preview-section">
        {sections.map((section) => (
          <SectionContainer
            key={section.id}
            sectionId={section.id}
            blocks={section.blocks}
            updateBlocks={updateBlocksInSection}
            previewMode={false}  // Edit mode
          />
        ))}
      </div>
    </Box>
  );
};

export default SiteBuilder;
