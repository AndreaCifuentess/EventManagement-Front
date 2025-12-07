import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEstablishments, updateEstablishment } from "../../../api/establishments";
import useSnackbar from "../../../hooks/useSnackbar";

export default function EditEstablishment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMounted = useRef(true);
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    city: "",
    capacity: "",
    type: "MEDIUM",
    cost: "",
    imageUrl: ""
  });

  const { showSnackbar, SnackbarComponent } = useSnackbar();

  // Opciones de tipo de establecimiento
  const ESTABLISHMENT_TYPES = [
    { value: "SMALL", label: "Pequeño", icon: "🏠", description: "Hasta 50 personas" },
    { value: "MEDIUM", label: "Mediano", icon: "🏢", description: "50-200 personas" },
    { value: "LARGE", label: "Grande", icon: "🏛️", description: "Más de 200 personas" }
  ];

  useEffect(() => {
    isMounted.current = true;
    loadEstablishment();
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadEstablishment = async () => {
    try {
      const allEstablishments = await getEstablishments();
      const establishment = allEstablishments.find(e => e.id === id);
      
      if (!establishment) {
        throw new Error("Establecimiento no encontrado");
      }
      
      if (isMounted.current) {
        setFormData({
          name: establishment.name || "",
          address: establishment.address || "",
          phone: establishment.phone || "",
          city: establishment.city || "",
          capacity: establishment.capacity || "",
          type: establishment.type || "MEDIUM",
          cost: establishment.cost || "",
          imageUrl: establishment.imageUrl || ""
        });
      }
      
    } catch (error) {
      console.error(" Error al cargar establecimiento:", error);
      
      if (isMounted.current) {
        showSnackbar(error.message || "Error al cargar el establecimiento", "error");
        
        const redirectTimer = setTimeout(() => {
          if (isMounted.current) {
            navigate("/admin/establishments");
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
    
    // Validaciones
    if (!formData.name.trim()) {
      showSnackbar("El nombre es requerido", "error");
      return;
    }
    if (!formData.city.trim()) {
      showSnackbar("La ciudad es requerida", "error");
      return;
    }
    if (!formData.capacity || formData.capacity <= 0) {
      showSnackbar("La capacidad debe ser mayor a 0", "error");
      return;
    }
    if (!formData.cost || formData.cost <= 0) {
      showSnackbar("El costo debe ser mayor a 0", "error");
      return;
    }
    
    setUpdating(true);

    try {
      const payload = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        capacity: parseInt(formData.capacity),
        type: formData.type,
        cost: parseFloat(formData.cost),
        imageUrl: formData.imageUrl.trim() 
      };
      
      await updateEstablishment(id, payload);
      showSnackbar(" Establecimiento actualizado exitosamente", "success");
      
      setTimeout(() => {
        if (isMounted.current) {
          navigate("/admin/establishments");
        }
      }, 1500);
      
    } catch (error) {
      console.error(" Error al actualizar:", error);
      
      // Manejo de errores mejorado
      if (error.response?.status === 400) {
        // Intentar mostrar el mensaje de error del backend
        const errorData = error.response.data;
        if (errorData.errors) {
          // Si hay errores de validación por campo
          const firstError = Object.values(errorData.errors)[0];
          showSnackbar(firstError, "error");
        } else if (errorData.message) {
          showSnackbar(errorData.message, "error");
        } else {
          showSnackbar("Error de validación", "error");
        }
      } else {
        showSnackbar(error.response?.data?.message || "Error al actualizar el establecimiento", "error");
      }
      
      setUpdating(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando establecimiento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {isMounted.current && <SnackbarComponent position="bottom" />}
      
      {/* Header con breadcrumb */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/admin/establishments")}
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
          Volver a establecimientos
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Establecimiento</h1>
            <p className="text-gray-500 text-sm mt-1">Modifica la información del establecimiento</p>
          </div>
        </div>
      </div>
      
      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Preview de imagen (si existe) */}
        {formData.imageUrl && (
          <div className="relative h-56 bg-gradient-to-br from-purple-50 to-purple-100 overflow-hidden">
            <img
              src={formData.imageUrl}  
              alt={formData.name}
              className="w-full h-full object-cover opacity-75"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            <div className="absolute bottom-4 left-6 right-6">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <div className="flex items-center space-x-2 mb-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Imagen actual</span>
                  </div>
                  <p className="text-2xl font-bold drop-shadow-lg">{formData.name || "Establecimiento"}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="p-8">
          {/* Grid de 2 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Nombre */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Nombre del Establecimiento
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:bg-gray-50"
                  placeholder="Ej: Salón de Eventos Jardín Real"
                  required
                  disabled={updating}
                />
                <svg 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>

            {/* Dirección */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Dirección
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:bg-gray-50"
                  placeholder="Ej: Av. Principal #123, Sector Centro"
                  disabled={updating}
                />
                <svg 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>

            {/* Ciudad */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Ciudad
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:bg-gray-50"
                  placeholder="Ej: Bogotá"
                  required
                  disabled={updating}
                />
                <svg 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Teléfono
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:bg-gray-50"
                  placeholder="Ej: +57 300 123 4567"
                  disabled={updating}
                />
                <svg 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            </div>

            {/* Capacidad */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Capacidad (personas)
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleChange('capacity', e.target.value)}
                  className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:bg-gray-50"
                  placeholder="Ej: 150"
                  min="1"
                  required
                  disabled={updating}
                />
                <svg 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>

            {/* Costo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Costo (COP)
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.cost}
                  onChange={(e) => handleChange('cost', e.target.value)}
                  className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:bg-gray-50"
                  placeholder="Ej: 500000"
                  min="0"
                  step="0.01"
                  required
                  disabled={updating}
                />
                <svg 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              {formData.cost && (
                <p className="text-xs text-gray-500 mt-2 ml-1">
                  ${parseFloat(formData.cost).toLocaleString('es-CO')} COP
                </p>
              )}
            </div>

            {/* URL de la Imagen */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                URL de la Imagen
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => handleChange('imageUrl', e.target.value)}
                  className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:bg-gray-50"
                  placeholder="Ej: https://ejemplo.com/imagen.jpg"
                  disabled={updating}
                />
                <svg 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Debe ser una URL válida. Si se deja vacío, se usará una imagen por defecto.
              </p>
            </div>
          </div>

          {/* Tipo de Establecimiento */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Tipo de Establecimiento
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ESTABLISHMENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleChange('type', type.value)}
                  disabled={updating}
                  className={`p-4 border-2 rounded-xl transition-all hover:shadow-md disabled:opacity-50 ${
                    formData.type === type.value
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <div className="font-semibold text-gray-900">{type.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm">
                <p className="text-blue-800 font-medium">Nota importante</p>
                <p className="text-blue-700 mt-1">
                  La imagen asociada se actualiza automáticamente. Los campos marcados con * son obligatorios.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/admin/establishments")}
            className="px-6 py-2.5 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-100 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={updating}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            disabled={updating || !formData.name.trim() || !formData.city.trim() || !formData.capacity || !formData.cost}
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