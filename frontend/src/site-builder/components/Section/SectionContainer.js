import React from 'react';
import { Box, Button } from '@mui/material';
import SectionContent from './SectionContent';  // Separate content component

const SectionContainer = ({ sectionId, blocks, updateBlocks, previewMode }) => {
  // Function to add a new block to the section
  const addBlock = () => {
    const newBlock = { id: `${sectionId}-${blocks.length + 1}`, content: `Block ${blocks.length + 1} of Section ${sectionId}` };
    updateBlocks(sectionId, [...blocks, newBlock]);  // Append the new block
  };

  return (
    <Box
      sx={{
        padding: 3,
        border: '1px solid transparent',
        position: 'relative',
        '&:hover': { borderColor: previewMode ? 'transparent' : 'blue' }, // Hover effect only in edit mode
      }}
    >
      {/* Only show the Add Block button in edit mode */}
      {!previewMode && (
        <Button
          variant="contained"
          onClick={addBlock}
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
          }}
        >
          Add Block
        </Button>
      )}

      {/* Render blocks */}
      <SectionContent blocks={blocks} />
    </Box>
  );
};

export default SectionContainer;
