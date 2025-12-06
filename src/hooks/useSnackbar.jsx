import { useState, useCallback, useEffect } from 'react';

const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState({
    message: '',
    type: 'success',
    isVisible: false,
  });

  const showSnackbar = useCallback((message, type = 'success') => {
    setSnackbar({
      message,
      type,
      isVisible: true,
    });
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, isVisible: false }));
  }, []);

  // Efecto para auto-ocultar el snackbar
  useEffect(() => {
    if (snackbar.isVisible) {
      const timer = setTimeout(() => {
        hideSnackbar();
      }, 4000); // Duración de 4 segundos

      return () => clearTimeout(timer);
    }
  }, [snackbar.isVisible, hideSnackbar]);

  const SnackbarComponent = useCallback(({ position = 'top' }) => {
    if (!snackbar.isVisible) return null;

    const positionClass = position === 'top' 
      ? 'top-4' 
      : position === 'bottom' 
      ? 'bottom-4' 
      : 'top-4';

    const bgColor = snackbar.type === 'success' 
      ? 'bg-green-500' 
      : snackbar.type === 'error' 
      ? 'bg-red-500' 
      : 'bg-blue-500';

    return (
      <div className={`fixed ${positionClass} left-1/2 transform -translate-x-1/2 z-50 animate-fade-in`}>
        <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center`}>
          <span className="mr-2">
            {snackbar.type === 'success' ? '✅' : '❌'}
          </span>
          <span>{snackbar.message}</span>
          <button
            onClick={hideSnackbar}
            className="ml-3 text-white hover:text-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }, [snackbar, hideSnackbar]);

  return {
    showSnackbar,
    hideSnackbar,
    SnackbarComponent,
    snackbarMessage: snackbar.message,
    snackbarType: snackbar.type,
    isSnackbarVisible: snackbar.isVisible,
  };
};

export default useSnackbar;