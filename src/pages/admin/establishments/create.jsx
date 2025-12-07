import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createEstablishment } from "../../../api/establishments";
import useSnackbar from "../../../hooks/useSnackbar";

export default function CreateEstablishment() {
  const navigate = useNavigate();
  const isMounted = useRef(true);
  const [creating, setCreating] = useState(false);
  const [errors, setErrors] = useState({}); 
  
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

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};
    
    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }
    
    // Validar dirección
    if (!formData.address.trim()) {
      newErrors.address = "La dirección es requerida";
    }
    
    // Validar teléfono
    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido";
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "El teléfono debe tener al menos 10 dígitos";
    }
    
    // Validar ciudad
    if (!formData.city.trim()) {
      newErrors.city = "La ciudad es requerida";
    }
    
    // Validar capacidad
    if (!formData.capacity) {
      newErrors.capacity = "La capacidad es requerida";
    } else if (Number(formData.capacity) <= 0) {
      newErrors.capacity = "La capacidad debe ser mayor a 0";
    }
    
    // Validar costo
    if (!formData.cost) {
      newErrors.cost = "El costo es requerido";
    } else if (Number(formData.cost) <= 0) {
      newErrors.cost = "El costo debe ser mayor a 0";
    }
    
    // Validar URL de imagen (si se proporciona)
    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = "URL de imagen inválida";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para validar URL
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Manejar cambios específicos para campos numéricos
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value === "" ? "" : value.replace(/[^0-9.]/g, "");
    setFormData(prev => ({ ...prev, [name]: numericValue }));
    
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar antes de enviar
    if (!validateForm()) {
      showSnackbar("Por favor, corrige los errores en el formulario", "error");
      return;
    }
    
    if (creating) return;

    setCreating(true);

    try {
      // Preparar datos para enviar
      const dataToSend = {
        ...formData,
        capacity: Number(formData.capacity),
        cost: Number(formData.cost),
        // Limpiar campos vacíos opcionales
        imageUrl: formData.imageUrl.trim() || null
      };

      console.log("Enviando datos:", dataToSend);
      
      await createEstablishment(dataToSend);
      showSnackbar(" Establecimiento creado exitosamente", "success");

      setTimeout(() => {
        navigate("/admin/establishments");
      }, 2000);

    } catch (error) {
      console.error("Error al crear establecimiento:", error);
      
      let errorMessage = "Error al crear establecimiento";
      if (error.response) {
        errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
      } else if (error.request) {
        errorMessage = "No se pudo conectar con el servidor";
      }
      
      showSnackbar(errorMessage, "error");
      setCreating(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.address.trim() &&
      formData.phone.trim() &&
      formData.city.trim() &&
      formData.capacity &&
      formData.cost &&
      Number(formData.capacity) > 0 &&
      Number(formData.cost) > 0
    );
  };

  // Opciones para el tipo de establecimiento
  const establishmentTypes = [
    { value: "SMALL", label: "Pequeño" },
    { value: "MEDIUM", label: "Mediano" },
    { value: "LARGE", label: "Grande" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <SnackbarComponent position="bottom" />
      
      <button
        onClick={() => navigate("/admin/establishments")}
        className="flex items-center text-purple-600 hover:text-purple-800 mb-8"
      >
        <span className="mr-2">←</span>
        Volver a la lista
      </button>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Nuevo Establecimiento</h1>
      <p className="text-gray-600 mb-8">Completa la información para crear un nuevo establecimiento</p>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.name ? "border-red-500" : ""
              }`}
              placeholder="Ej: Salón Primavera"
              disabled={creating}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          
          {/* Dirección */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.address ? "border-red-500" : ""
              }`}
              placeholder="Ej: Calle 45 #12-34"
              disabled={creating}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>
          
          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.phone ? "border-red-500" : ""
              }`}
              placeholder="Ej: 3001234567"
              disabled={creating}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
          
          {/* Ciudad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.city ? "border-red-500" : ""
              }`}
              placeholder="Ej: Bogotá"
              disabled={creating}
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>
          
          {/* Capacidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacidad (personas) *
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleNumberChange}
              min="1"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.capacity ? "border-red-500" : ""
              }`}
              placeholder="Ej: 200"
              disabled={creating}
            />
            {errors.capacity && (
              <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>
            )}
          </div>
          
          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Establecimiento *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={creating}
            >
              {establishmentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Costo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Costo ($) *
            </label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleNumberChange}
              min="0.01"
              step="0.01"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.cost ? "border-red-500" : ""
              }`}
              placeholder="Ej: 1500"
              disabled={creating}
            />
            {errors.cost && (
              <p className="text-red-500 text-sm mt-1">{errors.cost}</p>
            )}
          </div>
          
          {/* URL de Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de la Imagen
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.imageUrl ? "border-red-500" : ""
              }`}
              placeholder="Ej: https://example.com/image.jpg"
              disabled={creating}
            />
            {errors.imageUrl ? (
              <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>
            ) : (
              <p className="text-sm text-gray-500 mt-1">
                Opcional. Debe ser una URL válida de una imagen.
              </p>
            )}
          </div>
          
          {/* Campos obligatorios */}
          <div className="text-sm text-gray-500">
            <span className="text-red-500">*</span> Campos obligatorios
          </div>
          
          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate("/admin/establishments")}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={creating}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={creating || !isFormValid()}
            >
              {creating ? (
                <div className="flex items-center">
                  <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando...
                </div>
              ) : "Crear Establecimiento"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}