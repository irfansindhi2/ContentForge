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
    <div className="card bg-base-100 w-full shadow-xl flex flex-col h-full">
      <figure className="w-full">
        <img src={imageUrl} alt={imageAlt} className="object-cover w-full" />
      </figure>
      <div className="card-body flex-grow p-4 md:p-6 flex flex-col justify-between">
        <h2 className="card-title text-lg sm:text-xl md:text-2xl">{title}</h2>
        <p className="text-sm sm:text-base md:text-lg">{description}</p>
        <div className="card-actions mt-4 justify-end w-full">
          <button className="btn btn-primary w-full md:w-auto">{buttonText}</button>
        </div>
      </div>
    </div>
  );
};

export default CardBlock;
