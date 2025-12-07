import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCatering } from "../../../api/catering";
import useSnackbar from "../../../hooks/useSnackbar";

export default function CreateCatering() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    menuType: "BUFFET", 
    description: "",
    costDish: "",
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
    setLoading(true);

    try {
      // Convertir costDish a número decimal
      const dataToSend = {
        ...formData,
        costDish: parseFloat(formData.costDish) || 0
      };

      await createCatering(dataToSend);
      
      showSnackbar("Menú de catering creado exitosamente", "success");
      
      setTimeout(() => {
        navigate("/admin/catering");
      }, 1500);
      
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || 
        error.response?.data?.error || 
        "Error al crear el menú de catering", 
        "error"
      );
      
      console.error("Error creating catering:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener el color según el tipo de menú
  const getMenuTypeColor = (menuType) => {
    const colors = {
      'BUFFET': 'bg-blue-100 text-blue-800 border-blue-300',
      'VEGETARIANO': 'bg-green-100 text-green-800 border-green-300',
      'INFANTIL': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'GOURMET': 'bg-purple-100 text-purple-800 border-purple-300',
    };
    return colors[menuType] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div className="max-w-3xl mx-auto">
      <SnackbarComponent position="bottom" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Menú de Catering</h1>
        <p className="text-gray-600 mt-2">Agrega un nuevo menú de catering a tu catálogo</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow border p-6">
        <div className="space-y-6">
          {/* Tipo de Menú */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Menú *
            </label>
            <select
              name="menuType"
              value={formData.menuType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="BUFFET">Buffet</option>
              <option value="VEGETARIANO">Vegetariano</option>
              <option value="INFANTIL">Infantil</option>
              <option value="GOURMET">Gourmet</option>
            </select>
            <div className="mt-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getMenuTypeColor(formData.menuType)}`}>
                {formData.menuType}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Selecciona el tipo de menú para el catering.
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
              placeholder="Describe los platos incluidos, ingredientes especiales, opciones disponibles..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Incluye información relevante sobre el menú (opcional pero recomendado).
            </p>
          </div>

          {/* Costo por Plato */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Costo por Plato (USD) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="text"
                name="costDish"
                value={formData.costDish}
                onChange={handleNumberChange}
                required
                className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Precio por plato en dólares estadounidenses.
            </p>
          </div>

          {/* Vista previa de datos */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Vista previa del menú:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Tipo de Menú:</span> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${getMenuTypeColor(formData.menuType)}`}>
                  {formData.menuType}
                </span>
              </p>
              <p><span className="font-medium">Descripción:</span> {formData.description || "No especificada"}</p>
              <p><span className="font-medium">Costo por plato:</span> ${formData.costDish || "0.00"} USD</p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate("/admin/catering")}
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
              ) : "Crear Menú"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}