import React, { useState, useEffect, useCallback } from 'react';

// Main App Component to render the slider
export default function App() {
  const slideData = [
    {
      imgSrc: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmlydGhkYXklMjBwYXJ0eXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
      title: "Cumpleaños",
      description: "Celebra tu día especial con una fiesta inolvidable llena de alegría y diversión."
    },
    {
      imgSrc: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2VkZGluZ3xlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
      title: "Bodas",
      description: "El día más importante de tu vida merece una celebración perfecta y mágica."
    },
    {
      imgSrc: "https://academia.unad.edu.co/images/2024/diplo2024.jpg",
      title: "Grados",
      description: "Celebra tus logros académicos con una ceremonia digna de tu esfuerzo y dedicación."
    },
    {
      imgSrc: "https://dulcesfiestas.com.co/wp-content/uploads/elementor/thumbs/2_Ideas-para-decorar-bautizos-y-primera-comunion-qpa0xxnlh99xaia43oqxwwzx48wliev1h99y57voew.png",
      title: "Bautizos",
      description: "Una celebración espiritual llena de amor para dar la bienvenida a la fe."
    },
    {
      imgSrc: "https://saketos.es/wp-content/uploads/2025/03/ninas-de-un-ano-3-1-jpg.webp",
      title: "Fiesta Infantil",
      description: "Diversión garantizada para los más pequeños con juegos, sorpresas y mucha alegría."
    },
    {
      imgSrc: "https://m.media-amazon.com/images/I/71se54LSd8L._AC_UF1000,1000_QL80_.jpg",
      title: "Baby Shower",
      description: "Prepara la llegada del nuevo miembro de la familia con una celebración especial."
    },
    {
      imgSrc: "https://www.mujerde10.com/wp-content/uploads/2025/07/estilo-de-vida-decoracion-para-xv-anos-tendencias--1024x678.jpg",
      title: "Fiesta de 15 Años",
      description: "Una noche mágica e inolvidable para celebrar esta importante transición."
    },
    {
      imgSrc: "https://cdn0.bodas.com.mx/usr/4/3/7/0/cfb_2x_104532.jpg",
      title: "Despedida de Solter@",
      description: "La última celebración de soltería llena de sorpresas y momentos divertidos."
    },
    {
      imgSrc: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29uZmVyZW5jZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
      title: "Conferencias y Capacitaciones",
      description: "Espacios profesionales para el aprendizaje, networking y desarrollo empresarial."
    },
    {
      imgSrc: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29ycG9yYXRlJTIwbWVldGluZ3xlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
      title: "Reunión Corporativa",
      description: "Eventos empresariales que impulsan la productividad y el trabajo en equipo."
    }
  ];

  return (
    <div className="bg-gray-100 flex items-center justify-center font-sans sm:p-2">
      <EnhancedSlider slides={slideData} />
    </div>
  );
}

// Los componentes ChevronLeftIcon, ChevronRightIcon y EnhancedSlider se mantienen igual
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

// El componente EnhancedSlider se mantiene exactamente igual
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
