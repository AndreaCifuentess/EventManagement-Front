import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getEvents, deleteEvent } from "../../../api/events";
import useSnackbar from "../../../hooks/useSnackbar"; 

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    eventId: null,
    eventType: "",
  });
  const { showSnackbar, SnackbarComponent } = useSnackbar();  

  // URL base del backend
  const API_BASE_URL = 'http://localhost:8081';

  // Función para obtener la URL completa de la imagen
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // Si ya es una URL completa (comienza con http:// o https://)
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
  
    const path = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    const fullUrl = `${API_BASE_URL}${path}`;
    console.log(`Construyendo URL de imagen: ${imageUrl} -> ${fullUrl}`); // Para debug
    return fullUrl;
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await getEvents();
      console.log("Datos recibidos del backend:", data);
      setEvents(data);
    } catch (error) {
      showSnackbar("Error al cargar los eventos", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id, type) => {
    setDeleteModal({
      show: true,
      eventId: id,
      eventType: type,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      show: false,
      eventId: null,
      eventType: "",
    });
  };
  
  const confirmDelete = async () => {
    if (!deleteModal.eventId) return;
    try {
      await deleteEvent(deleteModal.eventId);
      setEvents(events.filter(event => event.id !== deleteModal.eventId));
      showSnackbar(`Evento "${deleteModal.eventType}" eliminado correctamente`, "success");
    } catch (error) {

       let errorMessage = "Error al eliminar el evento";
       if (error.response && error.response.data) {
        errorMessage = error.response.data.message || error.response.data.error || errorMessage;
      }
      showSnackbar(errorMessage, "error");
    } finally {
      closeDeleteModal();
    }
  };
  

  const filteredEvents = events.filter(event =>
    event.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando eventos...</p>
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
                ¿Eliminar evento?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                ¿Estás seguro de eliminar el evento <span className="font-semibold">"{deleteModal.eventType}"</span>?
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
          <h1 className="text-3xl font-bold text-gray-900">Tipos de Eventos</h1>
          <p className="text-gray-600 mt-2">Gestiona los diferentes tipos de eventos disponibles</p>
        </div>
        <Link
          to="/admin/events/create"
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <span className="mr-2">➕</span>
          Nuevo Tipo de Evento
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por tipo de evento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Lista de Eventos con scroll */}
      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden flex flex-col">
        {filteredEvents.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {events.length === 0 ? "No hay eventos creados" : "No se encontraron eventos"}
            </h3>
            <p className="text-gray-500 mb-4">
              {events.length === 0 
                ? "Comienza creando tu primer tipo de evento" 
                : "Intenta con otro término de búsqueda"}
            </p>
            {events.length === 0 && (
              <Link
                to="/admin/events/create"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Crear Primer Evento
              </Link>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[250px]">
                    Tipo de Evento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                    Imagen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEvents.map(event => {
                  // Obtener la URL completa de la imagen
                  const imageUrl = getImageUrl(event.imageUrl);
                  const hasImage = imageUrl && imageUrl.length > 0;
                  
                  return (
                    <tr key={event.id} className="hover:bg-gray-50">
                      {/* Tipo de Evento */}
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 text-lg">{event.type}</div>
                      </td>
                      
                      {/* Imagen */}
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {hasImage ? (
                            <div className="relative group">
                              <div className="w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                                <img 
                                  src={imageUrl} 
                                  alt={event.type}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
                                    console.error(`Error al cargar la imagen: ${imageUrl}`);
                                  }}
                                />
                              </div>
                              {/* Preview al hacer hover */}
                              <div className="hidden group-hover:block absolute z-20 top-0 left-40 bg-white p-3 rounded-lg shadow-xl border border-gray-200">
                                <div className="text-xs font-semibold text-gray-700 mb-2">Vista previa</div>
                                <img 
                                  src={imageUrl} 
                                  alt={event.type}
                                  className="w-48 h-48 object-cover rounded"
                                />
                                <div className="text-xs text-gray-500 mt-2 truncate max-w-xs">
                                  {imageUrl}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-purple-300">
                              <span className="text-4xl text-purple-400 mb-2">📷</span>
                              <span className="text-sm text-purple-600 font-medium">Sin imagen</span>
                            </div>
                          )}
                        </div>
                      </td>
                      
                      {/* Acciones */}
                      <td className="px-6 py-4">
                        <div className="flex space-x-3">
                          <Link
                            to={`/admin/events/edit/${event.id}`}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                          >
                            <span className="mr-2">✏️</span>
                            Editar
                          </Link>
                          <button
                            onClick={() => openDeleteModal(event.id, event.type)}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                          >
                            <span className="mr-2">🗑️</span>
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer con estadísticas */}
      <div className="mt-4 text-sm text-gray-600">
        <span className="font-medium">{filteredEvents.length}</span> de <span className="font-medium">{events.length}</span> eventos mostrados
        {searchTerm && filteredEvents.length > 0 && (
          <span className="ml-2 text-purple-600">
            (filtrado por: "{searchTerm}")
          </span>
        )}
      </div>
    </div>
  );
}