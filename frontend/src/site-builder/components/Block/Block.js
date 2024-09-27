import React from 'react';

const Block = ({ block, className = '' }) => {
  return (
    <div className={`w-36 h-36 bg-white shadow-lg rounded-md p-4 ${className}`}>
      {/* You can adjust the block size with Tailwind w-36 h-36 or customize further */}
      {block.type === 'text' && <p className="text-sm">{block.content}</p>}
    </div>
  );
};

export default Block;