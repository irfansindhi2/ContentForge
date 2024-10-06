import React from 'react';
import { Settings, PlusCircle, Copy, Trash2, ArrowUp, ArrowDown, Image, CreditCard } from 'lucide-react';

const SectionToolbar = ({ 
  addBlock, 
  onMoveUp, 
  onMoveDown, 
  toggleSettings, 
  onDuplicate, 
  onDelete, 
  isFirst, 
  isLast, 
  isDeletable 
}) => {
  return (
    <>
      <div className="absolute top-2 left-2 z-10 flex space-x-2">
        <button
          className="btn btn-circle"
          onClick={() => addBlock('text')}
        >
          <PlusCircle className="w-5 h-5" />
        </button>
        <button
          className="btn btn-circle"
          onClick={() => addBlock('carousel')}
        >
          <Image className="w-5 h-5" />
        </button>
        <button
          className="btn btn-circle"
          onClick={() => addBlock('card')}
        >
          <CreditCard className="w-5 h-5" />
        </button>
      </div>
      <div className="absolute top-2 right-2 z-10 flex space-x-2">
        {!isFirst && (
          <button
            className="btn btn-circle"
            onClick={onMoveUp}
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
        {!isLast && (
          <button
            className="btn btn-circle"
            onClick={onMoveDown}
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        )}
        <button
          className="btn btn-circle"
          onClick={toggleSettings}
        >
          <Settings className="w-5 h-5" />
        </button>
        <button
          className="btn btn-circle"
          onClick={onDuplicate}
        >
          <Copy className="w-5 h-5" />
        </button>
        {isDeletable && (
          <button
            className="btn btn-circle btn-error"
            onClick={onDelete}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
    </>
  );
};

export default SectionToolbar;