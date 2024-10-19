import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { XIcon, Settings, Copy } from 'lucide-react';
import { themes, fonts, getThemeByName, addNewTheme, updateTheme, deleteTheme, defaultTheme } from './themeManagement';
import { Z_INDEXES } from '../../utils/zIndexes';

const ThemeSettings = ({ isOpen, onClose, currentTheme, setCurrentTheme }) => {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme || defaultTheme);
  const [newThemeName, setNewThemeName] = useState('');
  const settingsRef = useRef(null);

  useEffect(() => {
    if (currentTheme) {
      setSelectedTheme(currentTheme);
    }
  }, [currentTheme]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleThemeChange = (themeName) => {
    const theme = getThemeByName(themeName);
    setSelectedTheme(theme);
    setCurrentTheme(theme);
  };

  const handleColorChange = (colorName, value) => {
    const updatedTheme = {
      ...selectedTheme,
      colors: { ...selectedTheme.colors, [colorName]: value },
    };
    setSelectedTheme(updatedTheme);
    updateTheme(selectedTheme.name, updatedTheme);
    setCurrentTheme(updatedTheme);
  };

  const handleFontChange = (font) => {
    const updatedTheme = { ...selectedTheme, font };
    setSelectedTheme(updatedTheme);
    updateTheme(selectedTheme.name, updatedTheme);
    setCurrentTheme(updatedTheme);
  };

  const handleNewTheme = () => {
    if (newThemeName) {
      const newTheme = { ...selectedTheme, name: newThemeName };
      addNewTheme(newTheme);
      setSelectedTheme(newTheme);
      setCurrentTheme(newTheme);
      setNewThemeName('');
    }
  };

  const colorOrder = ['primary', 'secondary', 'accent', 'background', 'text', 'border'];

  return isOpen && ReactDOM.createPortal(
    <div ref={settingsRef} className="fixed inset-y-0 right-0 w-80 bg-base-100 shadow-xl" style={{ zIndex: Z_INDEXES.THEME_SETTINGS_DRAWER }}>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Theme Settings</h2>
          <button className="btn btn-circle btn-ghost" onClick={onClose}>
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-4">
          <div className="space-y-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Select Theme</span>
              </label>
              <div className="dropdown w-full">
                <label tabIndex={0} className="btn btn-outline w-full justify-between">
                  {selectedTheme.name}
                  <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full">
                  {themes.map((theme) => (
                    <li key={theme.name}><a onClick={() => handleThemeChange(theme.name)}>{theme.name}</a></li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Colors</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {colorOrder.map((colorName) => (
                  <div key={colorName} className="flex flex-col items-center">
                    <input
                      type="color"
                      value={selectedTheme.colors[colorName]}
                      onChange={(e) => handleColorChange(colorName, e.target.value)}
                      className="w-full h-10 rounded cursor-pointer"
                    />
                    <span className="text-xs mt-1 capitalize">{colorName}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Font</span>
              </label>
              <div className="dropdown w-full">
                <label tabIndex={0} className="btn btn-outline w-full justify-between">
                  {selectedTheme.font}
                  <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full">
                  {fonts.map((font) => (
                    <li key={font}><a onClick={() => handleFontChange(font)}>{font}</a></li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Create New Theme</span>
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={newThemeName}
                  onChange={(e) => setNewThemeName(e.target.value)}
                  placeholder="New theme name"
                  className="input input-bordered flex-grow"
                />
                <button onClick={handleNewTheme} className="btn btn-primary ml-2">Create</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ThemeSettings;