// src/themeManagement.js

export const defaultTheme = {
    name: 'Default',
    colors: {
      primary: '#3B82F6',
      secondary: '#10B981',
      accent: '#F59E0B',
      background: '#FFFFFF',
      text: '#1F2937',
      border: '#E5E7EB',
    },
    font: 'sans-serif',
  };
  
  export const themes = [
    defaultTheme,
    {
      name: 'Dark',
      colors: {
        primary: '#60A5FA',
        secondary: '#34D399',
        accent: '#FBBF24',
        background: '#1F2937',
        text: '#F9FAFB',
        border: '#4B5563',
      },
      font: 'sans-serif',
    },
    // Add more predefined themes here
  ];
  
  export const fonts = [
    'sans-serif',
    'serif',
    'monospace',
    'cursive',
    'fantasy',
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Courier',
    'Verdana',
    'Georgia',
    'Palatino',
    'Garamond',
    'Bookman',
    'Comic Sans MS',
    'Trebuchet MS',
    'Arial Black',
    'Impact',
  ];
  
  export const getThemeByName = (name) => {
    return themes.find(theme => theme.name === name) || defaultTheme;
  };
  
  export const addNewTheme = (newTheme) => {
    themes.push(newTheme);
  };
  
  export const updateTheme = (name, updatedTheme) => {
    const index = themes.findIndex(theme => theme.name === name);
    if (index !== -1) {
      themes[index] = { ...themes[index], ...updatedTheme };
    }
  };
  
  export const deleteTheme = (name) => {
    const index = themes.findIndex(theme => theme.name === name);
    if (index !== -1) {
      themes.splice(index, 1);
    }
  };