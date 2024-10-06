import React, { useContext, useState, useRef } from 'react';
import SectionContent from './SectionContent';
import SectionToolbar from './SectionToolbar';
import { PreviewModeContext } from '../../PreviewModeContext';
import { mergeSettings } from '../../utils/settingsUtils';
import { getBlockConfig } from '../../utils/blockConfig';

const SectionContainer = ({ sectionId, blocks, updateBlocks, settings, updateSettings, onDuplicate, onDelete, onMoveUp, onMoveDown, isFirst, isLast, isDeletable }) => {
  const { previewMode } = useContext(PreviewModeContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteModalRef = useRef(null);

  const addBlock = (type = 'text') => {
    const config = getBlockConfig(type);
    const newBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: type,
      content: type === 'carousel' ? [] : `New ${type} block`,
      x: 0,
      w: config.defaultW,
      h: config.defaultH,
    };
    updateBlocks([...blocks, newBlock]);
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

  const handleSettingsChange = (newSettings) => {
    updateSettings(newSettings);
  };

  return (
    <div
      id={sectionId}
      className={`relative w-full ${!previewMode ? 'hover:outline hover:outline-2 hover:outline-blue-500 hover:outline-offset-[-2px] p-2 my-2' : ''}`}
    >
      {!previewMode && (
        <SectionToolbar
          addBlock={addBlock}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDuplicate={onDuplicate}
          onDelete={handleDeleteClick}
          isFirst={isFirst}
          isLast={isLast}
          isDeletable={isDeletable}
          settings={settings}
          updateSettings={handleSettingsChange}
        />
      )}
      <div className="relative">
        <SectionContent blocks={blocks} updateBlocks={updateBlocks} settings={settings} />
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