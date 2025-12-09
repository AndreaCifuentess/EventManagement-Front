import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getEntertainments, deleteEntertainment } from "../../../api/entertainments";
import useSnackbar from "../../../hooks/useSnackbar";

export default function EntertainmentsList() {
  const [entertainments, setEntertainments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    entertainmentId: null,
    entertainmentName: "",
  });
  const { showSnackbar, SnackbarComponent } = useSnackbar();

  useEffect(() => {
    loadEntertainments();
  }, []);

  const loadEntertainments = async () => {
    try {
      const data = await getEntertainments();
      console.log("Datos recibidos del backend:", data);
      setEntertainments(data);
    } catch (error) {
      showSnackbar("Error al cargar los elementos de entretenimiento", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id, name) => {
    setDeleteModal({
      show: true,
      entertainmentId: id,
      entertainmentName: name,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      show: false,
      entertainmentId: null,
      entertainmentName: "",
    });
  };
  
  const confirmDelete = async () => {
    if (!deleteModal.entertainmentId) return;
    try {
      await deleteEntertainment(deleteModal.entertainmentId);
      setEntertainments(entertainments.filter(entertainment => entertainment.id !== deleteModal.entertainmentId));
      showSnackbar(`"${deleteModal.entertainmentName}" eliminado correctamente`, "success");
    } catch (error) {
      let errorMessage = "Error al eliminar el elemento";
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || error.response.data.error || errorMessage;
      }
      showSnackbar(errorMessage, "error");
    } finally {
      closeDeleteModal();
    }
  };

  const filteredEntertainments = entertainments.filter(entertainment =>
    entertainment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entertainment.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entertainment.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para formatear la tarifa por hora
  const formatHourlyRate = (rate) => {
    return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(rate);
  };

  // Función para obtener el color según el tipo
  const getTypeColor = (type) => {
    const colors = {
      'ANIMADORES': 'bg-blue-100 text-blue-800',
      'MÚSICOS': 'bg-purple-100 text-purple-800',
      'DJ': 'bg-pink-100 text-pink-800',
      'COMEDIANTES': 'bg-yellow-100 text-yellow-800',
      'MAGOS': 'bg-indigo-100 text-indigo-800',
      'ACTORES': 'bg-green-100 text-green-800',
      'OTROS': 'bg-gray-100 text-gray-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando elementos de entretenimiento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Snackbar para mensajes */}
      <SnackbarComponent position="bottom" />
      
      {/* Modal de Confirmación para Eliminar */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <span className="text-2xl text-red-600">🗑️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                ¿Eliminar elemento?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                ¿Estás seguro de eliminar <span className="font-semibold">"{deleteModal.entertainmentName}"</span>?
                Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={closeDeleteModal}
                  className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Entretenimiento</h1>
          <p className="text-gray-600 mt-2">Gestiona animadores, músicos, DJs y otros servicios de entretenimiento</p>
        </div>
        <Link
          to="/admin/entertainment/create"
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <span className="mr-2">➕</span>
          Nuevo Servicio
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nombre, tipo o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Lista de Elementos con scroll */}
      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden flex flex-col">
        {filteredEntertainments.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">🎪</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {entertainments.length === 0 ? "No hay servicios de entretenimiento" : "No se encontraron servicios"}
            </h3>
            <p className="text-gray-500 mb-4">
              {entertainments.length === 0 
                ? "Comienza creando tu primer servicio de entretenimiento" 
                : "Intenta con otro término de búsqueda"}
            </p>
            {entertainments.length === 0 && (
              <Link
                to="/admin/entertainment/create"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Crear Primer Servicio
              </Link>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[300px]">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                    Tarifa por Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEntertainments.map(entertainment => (
                  <tr key={entertainment.id} className="hover:bg-gray-50">
                    {/* Nombre */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 text-lg">{entertainment.name}</div>
                    </td>
                    
                    {/* Tipo */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(entertainment.type)}`}>
                        {entertainment.type}
                      </span>
                    </td>
                    
                    {/* Descripción */}
                    <td className="px-6 py-4">
                      <div className="text-gray-600">
                        {entertainment.description ? (
                          <div className="line-clamp-2" title={entertainment.description}>
                            {entertainment.description}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Sin descripción</span>
                        )}
                      </div>
                    </td>
                    
                    {/* Tarifa por Hora */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-green-600">
                        {formatHourlyRate(entertainment.hourlyRate)}
                      </div>
                      <div className="text-sm text-gray-500">por hora</div>
                    </td>
                    
                    {/* Acciones */}
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <Link
                          to={`/admin/entertainment/edit/${entertainment.id}`}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                          <span className="mr-2">✏️</span>
                          Editar
                        </Link>
                        <button
                          onClick={() => openDeleteModal(entertainment.id, entertainment.name)}
                          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                        >
                          <span className="mr-2">🗑️</span>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer con estadísticas */}
      <div className="mt-4 text-sm text-gray-600">
        <span className="font-medium">{filteredEntertainments.length}</span> de <span className="font-medium">{entertainments.length}</span> servicios mostrados
        {searchTerm && filteredEntertainments.length > 0 && (
          <span className="ml-2 text-purple-600">
            (filtrado por: "{searchTerm}")
          </span>
        )}
      </div>
    </div>
  );
}