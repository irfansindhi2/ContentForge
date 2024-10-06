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
      minW: 9,
      minH: 4,
      defaultW: 9,
      defaultH: 4,
      defaultX: 0,
      defaultY: 0,
    },
    card: {
      minW: 5,
      minH: 7,
      defaultW: 5,
      defaultH: 7,
      defaultX: 0,
      defaultY: 0,
    },
  };
  
  export const getBlockConfig = (type) => {
    return blockConfig[type] || blockConfig.text; // Default to text block config if type not found
  };