import React from 'react';
import { Edit } from 'lucide-react';

const EditButton = ({ onClick, blockType }) => {
  const getEditText = () => {
    switch (blockType) {
      case 'text':
        return 'Edit Text';
      case 'carousel':
        return 'Edit Carousel';
      case 'card':
        return 'Edit Card';
      default:
        return 'Edit';
    }
  };

  return (
    <button
      className="btn btn-sm btn-ghost"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title={getEditText()}
    >
      <Edit className="w-4 h-4" />
    </button>
  );
};

export default EditButton;