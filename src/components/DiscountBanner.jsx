import { useState, useEffect } from "react";


const DiscountBanner = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Si hay token, asumimos que está logueado 
    setIsLoggedIn(!!token);

    // Escuchar cambios en el localStorage para actualizar el estado
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        setIsLoggedIn(!!e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (!showBanner || isLoggedIn) {
    return null;
  }

  return (
    <div className="bg-lime-500 text-black py-3 px-4 flex justify-center items-center relative font-semibold text-sm sm:text-base">
      <span className="text-center">
        🎉 <strong>20% OFF for new users</strong> — Sign Up now !!!
      </span>
      <button
        onClick={() => setShowBanner(false)}
        className="absolute right-4 text-xl font-bold text-black hover:text-red-600 top-1/2 -translate-y-1/2"
        aria-label="Close Banner"
      >
        ×
      </button>
    </div>
  );
};

export default DiscountBanner;