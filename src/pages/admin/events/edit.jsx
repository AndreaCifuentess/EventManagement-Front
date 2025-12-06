import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEvents, updateEvent } from "../../../api/events";
import useSnackbar from "../../../hooks/useSnackbar";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMounted = useRef(true);
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    imageUrl: ""
  });

  const { showSnackbar, SnackbarComponent } = useSnackbar();

  const API_BASE_URL = 'http://localhost:8081';

  useEffect(() => {
    isMounted.current = true;
    loadEvent();
    
    return () => {
      isMounted.current = false;
    };
  }, [id]);

  const loadEvent = async () => {
    try {
      const allEvents = await getEvents();
      const event = allEvents.find(e => e.id === id);
      
      if (!event) {
        throw new Error("Evento no encontrado");
      }
      
      if (isMounted.current) {
        setFormData({
          type: event.type || "",
          imageUrl: event.imageUrl || ""
        });
      }
      
    } catch (error) {
      console.error("❌ Error al cargar evento:", error);
      
      if (isMounted.current) {
        showSnackbar(error.message || "Error al cargar el evento", "error");
        
        const redirectTimer = setTimeout(() => {
          if (isMounted.current) {
            navigate("/admin/events");
          }
        }, 2000);
        
        return () => clearTimeout(redirectTimer);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updating) return;
    
    setUpdating(true);

    try {
      if (!formData.type.trim()) {
        showSnackbar("El tipo de evento es requerido", "error");
        setUpdating(false);
        return;
      }

      const payload = { type: formData.type.trim() };
      
      await updateEvent(id, payload);
      showSnackbar("✅ Evento actualizado exitosamente", "success");
      
      setTimeout(() => {
        if (isMounted.current) {
          navigate("/admin/events");
        }
      }, 1500);
      
    } catch (error) {
      console.error("❌ Error al actualizar:", error);
      
      if (isMounted.current) {
        showSnackbar(error.response?.data?.message || "Error al actualizar el evento", "error");
        setUpdating(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando evento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {isMounted.current && <SnackbarComponent position="bottom" />}
      
      {/* Header con breadcrumb mejorado */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/admin/events")}
          className="inline-flex items-center text-gray-600 hover:text-purple-600 mb-4 transition-colors group"
        >
          <svg 
            className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a eventos
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Evento</h1>
            <p className="text-gray-500 text-sm mt-1">Modifica la información del evento</p>
          </div>
        </div>
      </div>
      
      {/* Formulario con diseño mejorado */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Preview de imagen (si existe) */}
        {formData.imageUrl && (
          <div className="relative h-48 bg-gradient-to-br from-purple-50 to-purple-100 overflow-hidden">
            <img
              src={formData.imageUrl.startsWith('http') 
                ? formData.imageUrl 
                : `${API_BASE_URL}${formData.imageUrl.startsWith('/') ? '' : '/'}${formData.imageUrl}`}
              alt={formData.type}
              className="w-full h-full object-cover opacity-75"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="absolute bottom-4 left-6 text-white">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Imagen actual del evento</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="p-8">
          {/* Campo de tipo de evento */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Tipo de Evento
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Ej: Boda, Cumpleaños, Conferencia..."
                required
                disabled={updating}
              />
              <svg 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            {formData.type && (
              <p className="text-xs text-gray-500 mt-2 ml-1">
                {formData.type.length} caracteres
              </p>
            )}
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm">
                <p className="text-blue-800 font-medium">Nota importante</p>
                <p className="text-blue-700 mt-1">
                  La imagen asociada se actualiza automáticamente al guardar los cambios.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/admin/events")}
            className="px-6 py-2.5 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-100 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={updating}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            disabled={updating || !formData.type.trim()}
          >
            {updating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}