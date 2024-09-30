import React from 'react';

const Block = ({ block, className = '' }) => {
  const colSpan = Math.min(block.colSpan || 2, 24); // Assuming a max of 24 columns
  return (
    <div className={`col-span-${colSpan} bg-white shadow-lg rounded-md p-4 ${className}`}>
      {block.type === 'text' && <p className="text-sm">{block.content}</p>}
    </div>
  );
};

export default Block;