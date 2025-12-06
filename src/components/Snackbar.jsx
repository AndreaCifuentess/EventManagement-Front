import { useEffect, useState } from 'react';

const Snackbar = ({ 
  message, 
  type = 'success', // 'success' o 'error'
  duration = 4000,
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      
      // Auto cerrar después de la duración
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) setTimeout(onClose, 300); // Esperar a la animación
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message || !isVisible) return null;

  const bgColor = type === 'success' 
    ? 'bg-green-500' 
    : type === 'error' 
    ? 'bg-red-500' 
    : 'bg-blue-500';

  return (
    <div className="fixed inset-0 flex items-start justify-center pt-4 pointer-events-none z-50">
      <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg pointer-events-auto transform transition-all duration-300 animate-fade-in-down`}>
        <div className="flex items-center">
          <span className="mr-2">
            {type === 'success' ? '✅' : '❌'}
          </span>
          <span className="font-medium">{message}</span>
          <button
            onClick={() => {
              setIsVisible(false);
              if (onClose) setTimeout(onClose, 300);
            }}
            className="ml-3 text-white hover:text-gray-200 focus:outline-none"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default Snackbar;