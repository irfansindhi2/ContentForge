import React from 'react';

const Block = ({ block }) => {
  switch (block.type) {
    case 'text':
      return (
        <div>
          <p className="text-base">{block.content}</p>
        </div>
      );
    // Future block types can be added here
    // case 'image':
    //   return <img src={block.src} alt={block.alt} className="w-full h-auto" />;
    // case 'carousel':
    //   return <Carousel data={block.data} />;
    // case 'accordion':
    //   return <Accordion data={block.data} />;
    default:
      return null;
  }
};

export default Block;
