import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAdditional } from "../../../api/additional";
import useSnackbar from "../../../hooks/useSnackbar";

export default function CreateAdditional() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cost: "",
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
      const dataToSend = {
        ...formData,
        cost: parseFloat(formData.cost) || 0
      };

      await createAdditional(dataToSend);
      showSnackbar("Adicional creado exitosamente", "success");
      
      setTimeout(() => {
        navigate("/admin/additionals");
      }, 1500);
      
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || 
        error.response?.data?.error || 
        "Error al crear el adicional", 
        "error"
      );
      console.error("Error creating additional:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <SnackbarComponent position="bottom" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Adicional</h1>
        <p className="text-gray-600 mt-2">Agrega un nuevo adicional (extra, complemento, etc.)</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow border p-6">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ej: Refresco extra, Postre especial, etc."
            />
            <p className="mt-1 text-sm text-gray-500">
              Nombre identificador del adicional.
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
              placeholder="Describe el adicional, ingredientes, características..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Información detallada del adicional (opcional pero recomendado).
            </p>
          </div>

          {/* Costo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Costo (USD) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="text"
                name="cost"
                value={formData.cost}
                onChange={handleNumberChange}
                required
                className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Precio del adicional 
            </p>
          </div>

          {/* Vista previa de datos */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Vista previa del adicional:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Nombre:</span> {formData.name || "No especificado"}</p>
              <p><span className="font-medium">Descripción:</span> {formData.description || "No especificada"}</p>
              <p><span className="font-medium">Costo:</span> ${formData.cost || "0000"} COP</p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate("/admin/additionals")}
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
              ) : "Crear Adicional"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}