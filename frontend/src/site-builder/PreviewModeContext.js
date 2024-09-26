import React, { createContext, useState } from 'react';

export const PreviewModeContext = createContext();

export const PreviewModeProvider = ({ children }) => {
  const [previewMode, setPreviewMode] = useState(false);

  return (
    <PreviewModeContext.Provider value={{ previewMode, setPreviewMode }}>
      {children}
    </PreviewModeContext.Provider>
  );
};
