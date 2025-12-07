// src/pages/admin/entertainment/Create.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEntertainment } from "../../../api/entertainments";
import useSnackbar from "../../../hooks/useSnackbar";

export default function CreateEntertainment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "ANIMADORES", 
    description: "",
    hourlyRate: "",
  });
  
  const { showSnackbar, SnackbarComponent } = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;

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
    setLoading(true);

    try {
      // Convertir hourlyRate a número decimal
      const dataToSend = {
        ...formData,
        hourlyRate: parseFloat(formData.hourlyRate) || 0
      };

      await createEntertainment(dataToSend);
      
      showSnackbar("Servicio de entretenimiento creado exitosamente", "success");
      
      setTimeout(() => {
        navigate("/admin/entertainment");
      }, 1500);
      
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || 
        error.response?.data?.error || 
        "Error al crear el servicio de entretenimiento", 
        "error"
      );
      
      console.error("Error creating entertainment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <SnackbarComponent position="bottom" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Servicio de Entretenimiento</h1>
        <p className="text-gray-600 mt-2">Agrega un nuevo servicio de entretenimiento a tu catálogo</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow border p-6">
        <div className="space-y-6">
          {/* Nombre del Servicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Servicio *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ej: Animador Infantil, DJ para Fiestas, Mago Profesional..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Nombre descriptivo del servicio de entretenimiento.
            </p>
          </div>

          {/* Tipo de Entretenimiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Servicio *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="ANIMADORES">Animadores</option>
              <option value="MÚSICOS">Músicos</option>
              <option value="BAILARINES">Bailarines</option>
           
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Selecciona la categoría principal del servicio.
            </p>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Describe los detalles del servicio, habilidades especiales, experiencia..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Incluye información relevante sobre el servicio (opcional pero recomendado).
            </p>
          </div>

          {/* Tarifa por Hora */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tarifa por Hora *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="text"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleNumberChange}
                required
                className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Precio por hora del servicio en dólares estadounidenses.
            </p>
          </div>

          {/* Vista previa de datos */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Vista previa del servicio:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Nombre:</span> {formData.name || "No especificado"}</p>
              <p><span className="font-medium">Tipo:</span> {formData.type}</p>
              <p><span className="font-medium">Descripción:</span> {formData.description || "No especificada"}</p>
              <p><span className="font-medium">Tarifa por hora:</span> ${formData.hourlyRate || "0.00"} USD</p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate("/admin/entertainment")}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando...
                </>
              ) : "Crear Servicio"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}