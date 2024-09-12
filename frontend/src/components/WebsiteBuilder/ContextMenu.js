import React from 'react';

function ContextMenu({ x, y, onEdit, onDelete }) {
  return (
    <div 
      className="context-menu"
      style={{
        position: 'absolute',
        top: y,
        left: x,
        background: 'white',
        border: '1px solid #ccc',
        boxShadow: '2px 2px 5px rgba(0,0,0,0.1)',
        zIndex: 1000,
        padding: '5px'
      }}
    >
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
}

export default ContextMenu;