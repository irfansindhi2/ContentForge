import React, { useContext, useState } from 'react';
import SectionContent from './SectionContent';
import { PreviewModeContext } from '../../PreviewModeContext';
import { mergeSettings } from '../../utils/settingsUtils';

const SectionContainer = ({ sectionId, blocks, updateBlocks, settings, updateSettings }) => {
  const mergedSettings = mergeSettings(settings);
  const { previewMode } = useContext(PreviewModeContext);
  const [showSettings, setShowSettings] = useState(false);

  const addBlock = () => {
    const newBlock = {
      id: `${sectionId}-${blocks.length + 1}`,
      type: 'text',
      content: `Block ${blocks.length + 1} of Section ${sectionId}`,
      x: 0,
      y: Infinity,
    };
    updateBlocks([...blocks, newBlock]);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleSettingsChange = (event) => {
    const { name, value } = event.target;
    updateSettings({ ...mergedSettings, [name]: value });
  };

  return (
    <div className="relative w-full">
      {!previewMode && (
        <>
          <button className="btn btn-primary absolute top-2 left-2 z-10" onClick={addBlock}>
            Add Block
          </button>
          <button className="btn btn-secondary absolute top-2 left-20 z-10" onClick={toggleSettings}>
            Settings
          </button>
          {showSettings && (
            <div className="absolute top-10 left-20 bg-white p-4 shadow-lg z-20">
              <label>
                Margins:
                <select name="margins" value={mergedSettings.margins} onChange={handleSettingsChange}>
                  <option value="extra-large">Extra Large</option>
                  <option value="large">Large</option>
                  <option value="medium">Medium</option>
                  <option value="small">Small</option>
                  <option value="extra-small">Extra Small</option>
                  <option value="none">None</option>
                </select>
              </label>
            </div>
          )}
        </>
      )}
      <div className="relative bg-white">
        <SectionContent blocks={blocks} updateBlocks={updateBlocks} settings={mergedSettings} />
      </div>
    </div>
  );
};

export default SectionContainer;