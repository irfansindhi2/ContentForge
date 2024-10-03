import React from 'react';
import CarouselBlock from './CarouselBlock';
import CardBlock from './CardBlock';

const Block = React.memo(({ block, updateBlockContent }) => {

  return (
    <>
      {block.type === 'carousel' && <CarouselBlock items={block.content} />}
      {block.type === 'card' && <CardBlock content={block.content} />}
    </>
  );
});

export default Block;