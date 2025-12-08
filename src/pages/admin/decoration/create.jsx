import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDecoration } from "../../../api/decoration";
import useSnackbar from "../../../hooks/useSnackbar";

export default function CreateDecoration() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    articles: "",
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

  // SOLO NÚMEROS ENTEROS PARA COP (sin decimales)
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    // Permitir solo números (sin punto decimal para COP)
    const numericValue = value.replace(/[^0-9]/g, '');
    setFormData(prev => ({ 
      ...prev, 
      [name]: numericValue 
    }));
  };

  // Formatear número en formato colombiano
  const formatNumberCOP = (number) => {
    const num = parseInt(number || 0);
    return num.toLocaleString('es-CO');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convertir cost a número entero (pesos colombianos)
      const dataToSend = {
        ...formData,
        cost: parseInt(formData.cost) || 0
      };

      await createDecoration(dataToSend);
      showSnackbar("Decoración creada exitosamente", "success");
      
      setTimeout(() => {
        navigate("/admin/decoration");
      }, 1500);
      
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || 
        error.response?.data?.error || 
        "Error al crear la decoración", 
        "error"
      );
      console.error("Error creating decoration:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <SnackbarComponent position="bottom" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Crear Nueva Decoración</h1>
        <p className="text-gray-600 mt-2">Agrega una nueva decoración para eventos</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow border p-6">
        <div className="space-y-6">
          {/* Artículos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Artículos *
            </label>
            <textarea
              name="articles"
              value={formData.articles}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ej: Globos, manteles, flores, mesas, sillas, etc."
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Describe los artículos incluidos en la decoración.
            </p>
          </div>

          {/* Costo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Costo (COP) *
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
                placeholder="2000"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">COP</span>
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Precio de la decoración en pesos colombianos (sin decimales).
            </p>
          </div>

          {/* Vista previa */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Vista previa de la decoración
            </h3>
            <div className="text-sm">
              <div className="mb-2">
                <p className="text-gray-500">Artículos:</p>
                <p className="font-medium text-gray-900">
                  {formData.articles || "No especificados"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Costo:</p>
                <p className="font-medium text-green-600">
                  ${formatNumberCOP(formData.cost)} COP
                </p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate("/admin/decoration")}
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
              ) : "Crear Decoración"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}