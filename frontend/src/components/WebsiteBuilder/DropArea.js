import React from 'react';

function DropArea({ children }) {
  return (
    <div style={{ minHeight: '200px', border: '1px dashed gray', padding: '10px' }}>
      {children}
    </div>
  );
}

export default DropArea;