import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDecorationById, updateDecoration } from "../../../api/decoration";
import useSnackbar from "../../../hooks/useSnackbar";

export default function EditDecoration() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMounted = useRef(true);
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    articles: "",
    cost: ""
  });

  const { showSnackbar, SnackbarComponent } = useSnackbar();

  useEffect(() => {
    isMounted.current = true;
    loadDecoration();
    
    return () => {
      isMounted.current = false;
    };
  }, [id]);

  const loadDecoration = async () => {
    try {
      const decoration = await getDecorationById(id);
      
      if (!decoration) {
        throw new Error("Decoración no encontrada");
      }
      
      if (isMounted.current) {
        setFormData({
          articles: decoration.articles || "",
          cost: decoration.cost?.toString() || ""
        });
      }
      
    } catch (error) {
      console.error("Error al cargar decoración:", error);
      
      if (isMounted.current) {
        showSnackbar(error.message || "Error al cargar la decoración", "error");
        
        const redirectTimer = setTimeout(() => {
          if (isMounted.current) {
            navigate("/admin/decoration");
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
    if (updating) return;
    
    setUpdating(true);

    try {
      if (!formData.articles.trim()) {
        showSnackbar("Los artículos son requeridos", "error");
        setUpdating(false);
        return;
      }

      if (!formData.cost.trim()) {
        showSnackbar("El costo es requerido", "error");
        setUpdating(false);
        return;
      }

      const payload = {
        articles: formData.articles.trim(),
        // Convertir a número entero para COP
        cost: parseInt(formData.cost) || 0
      };
      
      await updateDecoration(id, payload);
      showSnackbar("Decoración actualizada exitosamente", "success");
      
      setTimeout(() => {
        if (isMounted.current) {
          navigate("/admin/decoration");
        }
      }, 1500);
      
    } catch (error) {
      console.error("Error al actualizar:", error);
      
      if (isMounted.current) {
        showSnackbar(
          error.response?.data?.message || 
          error.response?.data?.error || 
          "Error al actualizar la decoración", 
          "error"
        );
        setUpdating(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando decoración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {isMounted.current && <SnackbarComponent position="bottom" />}
      
      <div className="mb-8">
        <button
          onClick={() => navigate("/admin/decoration")}
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
          Volver a decoraciones
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-r from-green-100 to-green-50">
            <span className="text-2xl">🎨</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Decoración</h1>
            <p className="text-gray-500 text-sm mt-1">Modifica la información de la decoración</p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Artículos
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              name="articles"
              value={formData.articles}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              placeholder="Ej: Globos, manteles, flores, mesas, sillas, etc."
              required
              disabled={updating}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Costo (COP)
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 font-medium">$</span>
              </div>
              <input
                type="text"
                name="cost"
                value={formData.cost}
                onChange={handleNumberChange}
                className="w-full pl-10 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                placeholder="2000"
                required
                disabled={updating}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">COP</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 ml-1">
              Valor actual: ${formatNumberCOP(formData.cost)} pesos colombianos
            </p>
          </div>

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
        </div>

        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/admin/decoration")}
            className="px-6 py-2.5 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-all"
            disabled={updating}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium hover:from-purple-700 hover:to-purple-800 shadow-lg transition-all flex items-center"
            disabled={updating || !formData.articles.trim() || !formData.cost.trim()}
          >
            {updating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </>
            ) : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}