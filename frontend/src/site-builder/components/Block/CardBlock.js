import React from 'react';

const CardBlock = ({ content }) => {
  const {
    imageUrl = "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
    imageAlt = "Card Image",
    title = "Card Title",
    description = "This is a description for the card.",
    buttonText = "Action"
  } = content || {};

  return (
    <div className="card bg-base-100 w-full shadow-xl">
      <figure>
        <img src={imageUrl} alt={imageAlt} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{description}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">{buttonText}</button>
        </div>
      </div>
    </div>
  );
};

export default CardBlock;