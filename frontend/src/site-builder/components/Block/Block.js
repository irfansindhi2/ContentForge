import React from 'react';
import CarouselBlock from './CarouselBlock';
import CardBlock from './CardBlock';
import TextEditorBlock from './TextEditorBlock';

const Block = React.memo(({ block, updateBlockContent }) => {
  const colSpan = block.colSpan || 2;
  const rowSpan = block.rowSpan || 2;

  return (
    <div
      className="h-full w-full"
      style={{ gridColumn: `span ${colSpan}`, gridRow: `span ${rowSpan}` }}
    >
      {block.type === 'text' && (
        <TextEditorBlock block={block} updateBlockContent={updateBlockContent} />
      )}
      {block.type === 'carousel' && <CarouselBlock items={block.content} />}
      {block.type === 'card' && <CardBlock content={block.content} />}
    </div>
  );
});

export default Block;