import React, { useState } from 'react';
import { Plus, X, Type, Image, CreditCard, Settings, Copy, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Z_INDEXES } from '../../utils/zIndexes';

const BlockTypes = [
  { type: 'text', Icon: Type, label: 'Text' },
  { type: 'carousel', Icon: Image, label: 'Carousel' },
  { type: 'card', Icon: CreditCard, label: 'Card' }
];

const marginOptions = [
  { value: 'extra-large', label: 'XL' },
  { value: 'large', label: 'L' },
  { value: 'medium', label: 'M' },
  { value: 'small', label: 'S' },
  { value: 'extra-small', label: 'XS' },
  { value: 'none', label: 'None' },
];

const SectionToolbar = ({ 
  addBlock, 
  onMoveUp, 
  onMoveDown, 
  onDuplicate, 
  onDelete, 
  isFirst, 
  isLast, 
  isDeletable,
  settings,
  updateSettings
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
    setShowSettings(false);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    setIsOpen(false);
  };

  const handleSettingsChange = (value) => {
    updateSettings({ ...settings, margins: value });
  };

  return (
    <div className="absolute top-2 left-2 right-2 flex justify-between pointer-events-none" style={{ zIndex: Z_INDEXES.SECTION_TOOLBAR }}>
      <button 
        className="btn btn-circle pointer-events-auto" 
        onClick={toggleDrawer}
      >
        <Plus className="w-5 h-5" />
      </button>

      <div className="flex space-x-2 pointer-events-auto">
        {!isFirst && (
          <button className="btn btn-circle" onClick={onMoveUp}>
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
        {!isLast && (
          <button className="btn btn-circle" onClick={onMoveDown}>
            <ArrowDown className="w-5 h-5" />
          </button>
        )}
        <button className="btn btn-circle" onClick={toggleSettings}>
          <Settings className="w-5 h-5" />
        </button>
        <button className="btn btn-circle" onClick={onDuplicate}>
          <Copy className="w-5 h-5" />
        </button>
        {isDeletable && (
          <button className="btn btn-circle btn-error" onClick={onDelete}>
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50" style={{ zIndex: Z_INDEXES.ADD_BLOCK_DRAWER }}>
          <div className="drawer drawer-end">
            <input id="block-drawer" type="checkbox" className="drawer-toggle" checked={isOpen} readOnly />
            <div className="drawer-side">
              <label htmlFor="block-drawer" className="drawer-overlay"></label>
              <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Add Block</h2>
                  <button className="btn btn-ghost btn-circle" onClick={toggleDrawer}>
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <ul className="menu bg-base-100 w-full rounded-box">
                  {BlockTypes.map(({ type, Icon, label }) => (
                    <li key={type}>
                      <button 
                        className="flex items-center p-2"
                        onClick={() => {
                          addBlock(type);
                          toggleDrawer();
                        }}
                      >
                        <Icon className="w-6 h-6 mr-2" />
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="card bg-base-100 shadow-xl absolute top-14 right-2 p-4" style={{ zIndex: Z_INDEXES.SETTINGS_MODAL }}>
          <h2 className="text-lg font-bold mb-2">Cell Spacing</h2>
          <div className="join">
            {marginOptions.map((option) => (
              <input
                key={option.value}
                type="radio"
                name="margins"
                aria-label={option.label}
                className="join-item btn btn-sm"
                checked={settings.margins === option.value}
                onChange={() => handleSettingsChange(option.value)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionToolbar;