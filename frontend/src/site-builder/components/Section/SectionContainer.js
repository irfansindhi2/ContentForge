import React, { useContext, useState, useRef } from 'react';
import SectionContent from './SectionContent';
import { PreviewModeContext } from '../../PreviewModeContext';
import { mergeSettings } from '../../utils/settingsUtils';
import { Settings, PlusCircle, Copy, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

const SectionContainer = ({ sectionId, blocks, updateBlocks, settings, updateSettings, onDuplicate, onDelete, onMoveUp, onMoveDown, isFirst, isLast}) => {
  const mergedSettings = mergeSettings(settings);
  const { previewMode } = useContext(PreviewModeContext);
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteModalRef = useRef(null);

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

  const handleSettingsChange = (value) => {
    updateSettings({ ...mergedSettings, margins: value });
  };

  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate(sectionId, blocks, settings);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    if (deleteModalRef.current) {
      deleteModalRef.current.showModal();
    }
  };

  const handleDeleteConfirm = () => {
    onDelete();
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const marginOptions = [
    { value: 'extra-large', label: 'XL' },
    { value: 'large', label: 'L' },
    { value: 'medium', label: 'M' },
    { value: 'small', label: 'S' },
    { value: 'extra-small', label: 'XS' },
    { value: 'none', label: 'None' },
  ];

  return (
    <div 
      id={sectionId} 
      className={`relative w-full ${!previewMode ? 'hover:outline hover:outline-2 hover:outline-blue-500 hover:outline-offset-[-2px] p-2 my-2' : ''}`}
    >
      {!previewMode && (
        <>
          <button 
            className="btn btn-circle absolute top-2 left-2 z-10" 
            onClick={addBlock}
          >
            <PlusCircle className="w-5 h-5" />
          </button>
          <div className="absolute top-2 right-2 z-10 flex space-x-2">
            {!isFirst && (
              <button 
                className="btn btn-circle" 
                onClick={onMoveUp}
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            )}
            {!isLast && (
              <button 
                className="btn btn-circle" 
                onClick={onMoveDown}
              >
                <ArrowDown className="w-5 h-5" />
              </button>
            )}
            <button 
              className="btn btn-circle" 
              onClick={toggleSettings}
            >
              <Settings className="w-5 h-5" />
            </button>
            <button 
              className="btn btn-circle" 
              onClick={handleDuplicate}
            >
              <Copy className="w-5 h-5" />
            </button>
            <button 
              className="btn btn-circle btn-error" 
              onClick={handleDeleteClick}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </>
      )}
      {showSettings && (
        <div className="card bg-base-100 shadow-xl absolute top-14 right-2 z-20 p-4">
          <h2 className="text-lg font-bold mb-2">Cell Spacing</h2>
          <div className="join">
            {marginOptions.map((option) => (
              <input 
                key={option.value}
                type="radio" 
                name="margins" 
                aria-label={option.label}
                className="join-item btn btn-sm"
                checked={mergedSettings.margins === option.value}
                onChange={() => handleSettingsChange(option.value)}
              />
            ))}
          </div>
        </div>
      )}
      <div className="relative">
        <SectionContent blocks={blocks} updateBlocks={updateBlocks} settings={mergedSettings} />
      </div>

      {/* Daisy UI Modal for delete confirmation */}
      <dialog ref={deleteModalRef} className="modal modal-bottom sm:modal-middle">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">Confirm Deletion</h3>
          <p className="py-4">Are you sure you want to delete this section? This action cannot be undone.</p>
          <div className="modal-action">
            <button className="btn" onClick={handleDeleteCancel}>Cancel</button>
            <button className="btn btn-error" onClick={handleDeleteConfirm}>Delete</button>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button onClick={handleDeleteCancel}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default SectionContainer;