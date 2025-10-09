import React, { useState, useEffect, useCallback } from 'react';

// Main App Component to render the slider
export default function App() {
  const slideData = [
    {
      imgSrc: "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png",
      title: "Elegant Wedding Receptions",
      description: "Crafting unforgettable moments with stunning decor and seamless planning."
    },
    {
      imgSrc: "https://www.mrsfields.com/cdn/shop/articles/shutterstock_2408066691_1.jpg?v=1725556532",
      title: "Joyful Birthday Parties",
      description: "Celebrate another year with fun, laughter, and a party to remember."
    },
    {
      imgSrc: "https://floweraura-blog-img.s3.ap-south-1.amazonaws.com/Celebrate+Anniversary+travel/cvr.jpg",
      title: "Romantic Anniversaries",
      description: "Mark your special milestone with a celebration of your love story."
    },
    {
      imgSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzZg9yKSUy0oKJsxJZblexdfoMYhwUAtY2yA&s",
      title: "Corporate Holiday Events",
      description: "Boost team morale with a professionally organized and festive gathering."
    },
    {
      imgSrc: "https://5.imimg.com/data5/SELLER/Default/2022/8/QF/JF/PJ/2713142/retirement-party-decoration-service.JPG",
      title: "Honorable Retirement Parties",
      description: "Celebrate a legacy of hard work and dedication with a fitting send-off."
    },
    {
      imgSrc: "https://www.parents.com/thmb/JlKRSVpphFei1B17UE35pVnV5Fg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/shutterstock_762391612-41aca833e9184016833a754be5e7d5c3.jpg",
      title: "Baby Shower Celebrations",
      description: "Welcome the newest addition to the family with a beautiful and heartwarming event."
    },
  ];

  return (
    <div className="bg-gray-100 flex items-center justify-center font-sans sm:p-2">
      <EnhancedSlider slides={slideData} />
    </div>
  );
}


const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);


function EnhancedSlider({ slides }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = useCallback(() => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides.length]);

  const nextSlide = useCallback(() => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides.length]);

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    const sliderInterval = setInterval(() => {
      nextSlide();
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(sliderInterval);
  }, [nextSlide]);

  return (
    <div className="w-full max-w-5xl mx-auto relative group ">
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden rounded-2xl shadow-2xl border-4 border-white">
        {/* Slides container */}
        <div 
          className="w-full h-full flex transition-transform ease-out duration-700"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 relative">
              <img
                src={slide.imgSrc}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4 sm:p-6 md:p-8 text-white text-left">
                <h3 className="text-2xl md:text-4xl font-bold tracking-tight">
                  {slide.title}
                </h3>
                <p className="text-sm md:text-lg mt-2 max-w-lg">
                  {slide.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-4 z-10 p-2 rounded-full bg-black/30 text-white hover:bg-black/60 transition-all opacity-70 group-hover:opacity-100"
      >
        <ChevronLeftIcon />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 z-10 p-2 rounded-full bg-black/30 text-white hover:bg-black/60 transition-all opacity-70 group-hover:opacity-100"
      >
        <ChevronRightIcon />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`h-2.5 rounded-full transition-all duration-300 ${currentIndex === slideIndex ? 'w-6 bg-white' : 'w-2.5 bg-white/70 hover:bg-white'}`}
          />
        ))}
      </div>
    </div>
  );
}

