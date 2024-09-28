import React from 'react';

const Block = ({ block, className = '' }) => {
  return (
    <div className={`w-36 h-36 bg-white shadow-lg rounded-md p-4 ${className}`}>
      {/* Adjust the block size with Tailwind CSS or customize further */}
      {block.type === 'text' && <p className="text-sm">{block.content}</p>}
    </div>
  );
};

export default Block;