import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SectionContainer from './components/Section/SectionContainer';

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
    <div className="p-4">
      <button
        className="btn btn-primary"
        onClick={handlePreview}
      >
        Preview Mode
      </button>
      <button
        className="btn btn-secondary ml-4"
        onClick={addSection}
      >
        Add Section
      </button>

      <div id="preview-section" className="mt-4">
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
    </div>
  );
};

export default SiteBuilder;
