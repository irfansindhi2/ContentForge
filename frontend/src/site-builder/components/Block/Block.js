import React from 'react';

const Block = React.memo(({ block }) => {
  // Default dimensions if not provided
  const colSpan = block.colSpan || 2;
  const rowSpan = block.rowSpan || 2;

  return (
    <div
      className="h-full w-full bg-white shadow-lg rounded-md p-4 overflow-hidden box-border"
      style={{ gridColumn: `span ${colSpan}`, gridRow: `span ${rowSpan}` }}
    >
      {block.type === 'text' && <p className="text-sm">{block.content}</p>}
      {/* Add more block types as needed */}
    </div>
  );
});

export default Block;