import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

// This renders blocks based on their type
const SectionContent = ({ blocks }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {blocks.map((block) => (
        <Paper key={block.id} elevation={3} sx={{ padding: 2 }}>
          <Typography variant="body1">{block.content}</Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default SectionContent;
