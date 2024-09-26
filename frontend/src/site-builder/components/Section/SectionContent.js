import React from 'react';

const SectionContent = ({ blocks }) => {
  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block) => (
        <div key={block.id} className="p-4 bg-white shadow-md rounded-md">
          <p className="text-base">{block.content}</p>
        </div>
      ))}
    </div>
  );
};

export default SectionContent;