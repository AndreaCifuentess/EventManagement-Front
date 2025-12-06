// src/pages/admin/events/Create.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../../api/events";
import Snackbar from "../../../components/Snackbar";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
  });
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "success",
    show: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Solo envía el formData directamente
      await createEvent(formData);
      
      // Mostrar snackbar de éxito
      setSnackbar({
        message: "✅ Evento creado exitosamente",
        type: "success",
        show: true,
      });
      
      // Redirigir después de 2 segundos para que el usuario vea el mensaje
      setTimeout(() => {
        navigate("/admin/events");
      }, 2000);
      
    } catch (error) {
      // Mostrar snackbar de error
      setSnackbar({
        message: `❌ ${error.response?.data?.message || "Error al crear el evento"}`,
        type: "error",
        show: true,
      });
      
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, show: false }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Snackbar para mostrar mensajes */}
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        show={snackbar.show}
        onClose={handleCloseSnackbar}
        duration={4000}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Tipo de Evento</h1>
        <p className="text-gray-600 mt-2">Define un nuevo tipo de evento para tu catálogo</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow border p-6">
        <div className="space-y-6">
          {/* Tipo de Evento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Evento *
            </label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ej: Boda, Cumpleaños, Conferencia..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Este será el nombre del tipo de evento que aparecerá en el sistema.
            </p>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate("/admin/events")}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Creando..." : "Crear Evento"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}