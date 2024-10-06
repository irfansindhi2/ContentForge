// utils/blockConfig.js

export const blockConfig = {
    text: {
      minW: 2,
      minH: 2,
      defaultW: 6,
      defaultH: 2,
      defaultX: 0,
      defaultY: 0,
    },
    carousel: {
      minW: 4,
      minH: 4,
      defaultW: 8,
      defaultH: 4,
      defaultX: 0,
      defaultY: 0,
    },
    card: {
      minW: 3,
      minH: 4,
      defaultW: 6,
      defaultH: 4,
      defaultX: 0,
      defaultY: 0,
    },
  };
  
  export const getBlockConfig = (type) => {
    return blockConfig[type] || blockConfig.text; // Default to text block config if type not found
  };