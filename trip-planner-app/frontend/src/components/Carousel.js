import React, { useState } from "react";

// src/components/Carousel.js

const Carousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <p className="text-gray-700 italic">{items[currentIndex].quote}</p>
        <h4 className="mt-4 text-lg font-semibold">{items[currentIndex].name}</h4>
        <span className="text-gray-500 text-sm">{items[currentIndex].role}</span>
      </div>
      <div className="absolute top-1/2 transform -translate-y-1/2 left-4">
        <button
          onClick={handlePrevious}
          className="bg-gray-300 p-2 rounded-full hover:bg-gray-400"
        >
          &larr;
        </button>
      </div>
      <div className="absolute top-1/2 transform -translate-y-1/2 right-4">
        <button
          onClick={handleNext}
          className="bg-gray-300 p-2 rounded-full hover:bg-gray-400"
        >
          &rarr;
        </button>
      </div>
    </div>
  );
};

export default Carousel;
