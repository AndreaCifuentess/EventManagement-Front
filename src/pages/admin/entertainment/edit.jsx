// src/pages/admin/entertainment/Edit.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEntertainments, updateEntertainment } from "../../../api/entertainments";
import useSnackbar from "../../../hooks/useSnackbar";

export default function EditEntertainment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMounted = useRef(true);
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "ANIMADORES",
    description: "",
    hourlyRate: ""
  });

  const { showSnackbar, SnackbarComponent } = useSnackbar();

  useEffect(() => {
    isMounted.current = true;
    loadEntertainment();
    
    return () => {
      isMounted.current = false;
    };
  }, [id]);

  const loadEntertainment = async () => {
    try {
      const allEntertainments = await getEntertainments();
      const entertainment = allEntertainments.find(e => e.id === id);
      
      if (!entertainment) {
        throw new Error("Servicio de entretenimiento no encontrado");
      }
      
      if (isMounted.current) {
        setFormData({
          name: entertainment.name || "",
          type: entertainment.type || "ANIMADORES",
          description: entertainment.description || "",
          hourlyRate: entertainment.hourlyRate?.toString() || ""
        });
      }
      
    } catch (error) {
      console.error("Error al cargar servicio:", error);
      
      if (isMounted.current) {
        showSnackbar(error.message || "Error al cargar el servicio", "error");
        
        const redirectTimer = setTimeout(() => {
          if (isMounted.current) {
            navigate("/admin/entertainment");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    // Permitir solo números y un punto decimal
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Validar que solo haya un punto decimal
    const parts = numericValue.split('.');
    if (parts.length > 2) return;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: numericValue 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updating) return;
    
    setUpdating(true);

    try {
      // Validaciones
      if (!formData.name.trim()) {
        showSnackbar("El nombre del servicio es requerido", "error");
        setUpdating(false);
        return;
      }

      if (!formData.type.trim()) {
        showSnackbar("El tipo de servicio es requerido", "error");
        setUpdating(false);
        return;
      }

      if (!formData.hourlyRate.trim()) {
        showSnackbar("La tarifa por hora es requerida", "error");
        setUpdating(false);
        return;
      }

      // Preparar datos para enviar
      const payload = {
        name: formData.name.trim(),
        type: formData.type.trim(),
        description: formData.description.trim(),
        hourlyRate: parseFloat(formData.hourlyRate) || 0
      };
      
      await updateEntertainment(id, payload);
      showSnackbar("Servicio actualizado exitosamente", "success");
      
      setTimeout(() => {
        if (isMounted.current) {
          navigate("/admin/entertainment");
        }
      }, 1500);
      
    } catch (error) {
      console.error(" Error al actualizar:", error);
      
      if (isMounted.current) {
        showSnackbar(
          error.response?.data?.message || 
          error.response?.data?.error || 
          "Error al actualizar el servicio", 
          "error"
        );
        setUpdating(false);
      }
    }
  };

  // Función para obtener el color según el tipo
  const getTypeColor = (type) => {
    const colors = {
      'ANIMADORES': 'bg-blue-100 text-blue-800 border-blue-300',
      'MÚSICOS': 'bg-purple-100 text-purple-800 border-purple-300',
      'DJ': 'bg-pink-100 text-pink-800 border-pink-300',
      'COMEDIANTES': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'MAGOS': 'bg-indigo-100 text-indigo-800 border-indigo-300',
      'ACTORES': 'bg-green-100 text-green-800 border-green-300',
      'OTROS': 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando servicio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {isMounted.current && <SnackbarComponent position="bottom" />}
      
      {/* Header con breadcrumb */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/admin/entertainment")}
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
          Volver a servicios
        </button>
        
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${getTypeColor(formData.type)}`}>
            <span className="text-lg font-bold">
              {formData.type === 'ANIMADORES' && '🎭'}
              {formData.type === 'MÚSICOS' && '🎵'}
              {formData.type === 'DJ' && '🎧'}
              {formData.type === 'COMEDIANTES' && '😄'}
              {formData.type === 'MAGOS' && '🎩'}
              {formData.type === 'ACTORES' && '🎬'}
              {formData.type === 'OTROS' && '🎪'}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Servicio</h1>
            <p className="text-gray-500 text-sm mt-1">Modifica la información del servicio de entretenimiento</p>
          </div>
        </div>
      </div>
      
      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8">
          {/* Campo de nombre */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Nombre del Servicio
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Ej: Animador Infantil, DJ Profesional..."
                required
                disabled={updating}
              />
              <svg 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            {formData.name && (
              <p className="text-xs text-gray-500 mt-2 ml-1">
                {formData.name.length} caracteres
              </p>
            )}
          </div>

          {/* Campo de tipo */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Tipo de Servicio
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:bg-gray-50 disabled:text-gray-500"
              required
              disabled={updating}
            >
              <option value="ANIMADORES">Animadores</option>
              <option value="MÚSICOS">Músicos</option>
              <option value="DJ">DJ</option>
              <option value="COMEDIANTES">Comediantes</option>
              <option value="MAGOS">Magos</option>
              <option value="ACTORES">Actores</option>
              <option value="OTROS">Otros</option>
            </select>
            <div className="mt-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(formData.type)}`}>
                {formData.type}
              </span>
            </div>
          </div>

          {/* Campo de descripción */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Describe los detalles del servicio, habilidades especiales, experiencia..."
              disabled={updating}
            />
            {formData.description && (
              <p className="text-xs text-gray-500 mt-2 ml-1">
                {formData.description.length} caracteres
              </p>
            )}
          </div>

          {/* Campo de tarifa por hora */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Tarifa por Hora (USD)
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 font-medium">$</span>
              </div>
              <input
                type="text"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleNumberChange}
                className="w-full pl-10 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="0.00"
                required
                disabled={updating}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">USD/hora</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 ml-1">
              Valor actual: ${parseFloat(formData.hourlyRate || 0).toFixed(2)} por hora
            </p>
          </div>

          {/* Vista previa de datos */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-xl border border-purple-100 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Vista previa del servicio
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Nombre:</p>
                <p className="font-medium text-gray-900">{formData.name || "No especificado"}</p>
              </div>
              <div>
                <p className="text-gray-500">Tipo:</p>
                <p className="font-medium">
                  <span className={`px-2 py-1 rounded text-xs ${getTypeColor(formData.type)}`}>
                    {formData.type}
                  </span>
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-500">Descripción:</p>
                <p className="font-medium text-gray-900">
                  {formData.description || "Sin descripción"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Tarifa por hora:</p>
                <p className="font-medium text-green-600">
                  ${parseFloat(formData.hourlyRate || 0).toFixed(2)} USD
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/admin/entertainment")}
            className="px-6 py-2.5 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-100 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={updating}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            disabled={updating || !formData.name.trim() || !formData.type.trim() || !formData.hourlyRate.trim()}
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