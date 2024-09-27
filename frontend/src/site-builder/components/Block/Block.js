import React from 'react';

const Block = ({ block }) => {
  // Define the size classes here
  const sizeClasses = "w-full h-32"; // Adjust these classes as needed

  const renderContent = () => {
    switch (block.type) {
      case 'text':
        return <p className="text-base">{block.content}</p>;
      // Add cases for other block types here
      default:
        return null;
    }
  };

  return (
    <div className={`${sizeClasses} p-4 bg-white shadow-md rounded-md overflow-hidden`}>
      {renderContent()}
    </div>
  );
};

export default Block;