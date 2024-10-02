import defaultSettings from '../defaultSettings';

export const mergeSettings = (settings) => ({
  ...defaultSettings,
  ...(settings || {}),
});