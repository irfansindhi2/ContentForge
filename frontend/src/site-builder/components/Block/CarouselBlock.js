import React from 'react';

const CarouselBlock = ({ items = [] }) => {
  // Default items
  const defaultItems = [
    { src: "https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp", alt: "Burger 1" },
    { src: "https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp", alt: "Burger 2" },
    { src: "https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp", alt: "Burger 3" },
    { src: "https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp", alt: "Burger 4" },
    { src: "https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp", alt: "Burger 5" },
    { src: "https://img.daisyui.com/images/stock/photo-1559181567-c3190ca9959b.webp", alt: "Burger 6" },
    { src: "https://img.daisyui.com/images/stock/photo-1601004890684-d8cbf643f5f2.webp", alt: "Burger 7" }
  ];

  // Use provided items or default items
  const carouselItems = items.length > 0 ? items : defaultItems;

  return (
    <div className="carousel carousel-center rounded-box w-full h-full p-4 space-x-4 bg-neutral">
      {carouselItems.map((item, index) => (
        <div key={index} className="carousel-item h-full">
          <img
            src={item.src}
            alt={item.alt}
            className="rounded-box object-cover h-full w-full"
          />
        </div>
      ))}
    </div>
  );
};

export default CarouselBlock;