import React from 'react';

const CardBlock = ({ content }) => {
  const {
    heading = "Article Title",
    issue_date = new Date().toISOString(),
    body = "No content available",
    imageUrl = "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
    imageAlt = "Article Image"
  } = content || {};

  // Function to truncate the body text to 20 words
  const truncateBody = (text, wordLimit) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };

  // Remove HTML tags from the body
  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const truncatedBody = truncateBody(stripHtml(body), 20);
  const formattedDate = new Date(issue_date).toLocaleDateString();

  return (
    <div className="card bg-base-100 w-full h-full shadow flex flex-col overflow-hidden">
      <figure className="w-full h-0 pb-[56.25%] relative">
        <img src={imageUrl} alt={imageAlt} className="absolute top-0 left-0 w-full h-full object-cover" />
      </figure>
      <div className="card-body flex-grow p-4 flex flex-col justify-between">
        <div>
          <h2 className="card-title text-base sm:text-lg lg:text-xl line-clamp-2">{heading}</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">{formattedDate}</p>
          <p className="text-sm sm:text-base mt-2 line-clamp-3">{truncatedBody}</p>
        </div>
        <div className="card-actions mt-2 justify-end">
          <button className="btn btn-primary btn-sm">Read More</button>
        </div>
      </div>
    </div>
  );
};

export default CardBlock;