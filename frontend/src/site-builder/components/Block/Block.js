import React from 'react';
import CarouselBlock from './CarouselBlock';
import CardBlock from './CardBlock';
import TextBlock from './TextBlock';

const Block = React.memo(({ block, updateBlockContent }) => {
  return (
    <>
      {block.type === 'carousel' && <CarouselBlock items={block.content} />}
      {block.type === 'card' && <CardBlock content={block.content} />}
      {block.type === 'text' && (
        <TextBlock
          content={block.content}
          updateContent={(newContent) => updateBlockContent(newContent)}
        />
      )}
    </>
  );
});

export default Block;