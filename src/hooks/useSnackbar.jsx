import { useState, useCallback, useRef } from 'react';

const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState({
    message: '',
    type: 'success',
    isVisible: false,
  });
  
  const timeoutRef = useRef(null);

  const showSnackbar = useCallback((message, type = 'success') => {
 
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setSnackbar({
      message,
      type,
      isVisible: true,
    });
    
    // Auto-ocultar después de 4 segundos
    timeoutRef.current = setTimeout(() => {
      hideSnackbar();
    }, 4000);
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, isVisible: false }));
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const SnackbarComponent = useCallback(({ position = 'top' }) => {
    if (!snackbar.isVisible) return null;

    const positionClass = {
      top: 'top-4',
      bottom: 'bottom-4',
      'top-right': 'top-4 right-4',
      'bottom-right': 'bottom-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-left': 'bottom-4 left-4',
    }[position] || 'top-4';

    const bgColor = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500',
    }[snackbar.type] || 'bg-gray-500';

    const icon = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
    }[snackbar.type] || '💡';

    return (
      <div className={`fixed ${positionClass} z-50 animate-fade-in`}>
        <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center min-w-[300px] max-w-md transition-all duration-300 transform translate-y-0`}>
          <span className="mr-2 text-lg">{icon}</span>
          <span className="flex-1 font-medium">{snackbar.message}</span>
          <button
            onClick={hideSnackbar}
            className="ml-3 text-white hover:text-gray-200 transition-colors text-lg font-bold"
            aria-label="Cerrar"
          >
            ×
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