import React from 'react';

const Block = ({ block, className = '' }) => {
  return (
    <div className={`col-span-2 row-span-2 bg-white shadow-lg rounded-md p-4 ${className}`}>
      {/* Adjust the block size with Tailwind CSS or customize further */}
      {block.type === 'text' && <p className="text-sm">{block.content}</p>}
    </div>
  );
};

export default Block;