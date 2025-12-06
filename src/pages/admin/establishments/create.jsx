import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createEstablishment } from "../../../api/establishments";
import useSnackbar from "../../../hooks/useSnackbar";

export default function CreateEstablishment() {s
  const navigate = useNavigate();
  const isMounted = useRef(true);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    description: ""
  });

  const { showSnackbar, SnackbarComponent } = useSnackbar();

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (creating) return;

    setCreating(true);

    try {
      if (!formData.name.trim()) {
        showSnackbar("El nombre es requerido", "error");
        setCreating(false);
        return;
      }

      await createEstablishment(formData);
      showSnackbar("Establecimiento creado exitosamente", "success");

      setTimeout(() => {
        if (isMounted.current) {
          navigate("/admin/establishments");
        }
      }, 1500);
    } catch (error) {
      console.error("Error al crear establecimiento:", error);
      showSnackbar(error.response?.data?.message || "Error al crear establecimiento", "error");
      setCreating(false);
    }
  };

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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ej: Salón de Fiestas Las Palmas"
              disabled={creating}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ej: Calle Principal #123"
              disabled={creating}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ej: +1 234 567 8900"
              disabled={creating}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ej: contacto@establecimiento.com"
              disabled={creating}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Describe el establecimiento..."
              disabled={creating}
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate("/admin/establishments")}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={creating}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              disabled={creating || !formData.name.trim()}
            >
              {creating ? "Creando..." : "Crear Establecimiento"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}