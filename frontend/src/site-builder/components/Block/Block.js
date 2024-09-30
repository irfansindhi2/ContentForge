import React from 'react';

const Block = ({ block }) => {
  return (
    <div className="h-full w-full bg-white shadow-lg rounded-md p-4 overflow-hidden box-border">
      {block.type === 'text' && <p className="text-sm">{block.content}</p>}
      {/* Add more block types here as needed */}
    </div>
  );
};

export default Block;