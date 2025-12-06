import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getEstablishments, deleteEstablishment } from "../../../api/establishments";
import useSnackbar from "../../../hooks/useSnackbar";

export default function EstablishmentsList() {
  const [establishments, setEstablishments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    establishmentId: null,
    establishmentName: "",
  });

  const { showSnackbar, SnackbarComponent } = useSnackbar();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    loadEstablishments();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadEstablishments = async () => {
    try {
      const data = await getEstablishments();
      if (isMounted.current) {
        setEstablishments(data);
      }
    } catch (error) {
      showSnackbar("Error al cargar los establecimientos", "error");
      console.error(error);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const openDeleteModal = (id, name) => {
    setDeleteModal({
      show: true,
      establishmentId: id,
      establishmentName: name,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      show: false,
      establishmentId: null,
      establishmentName: "",
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.establishmentId) return;

    try {
      await deleteEstablishment(deleteModal.establishmentId);
      if (isMounted.current) {
        setEstablishments(establishments.filter(est => est.id !== deleteModal.establishmentId));
        showSnackbar(`Establecimiento "${deleteModal.establishmentName}" eliminado correctamente`, "success");
      }
    } catch (error) {
      showSnackbar("Error al eliminar el establecimiento", "error");
      console.error(error);
    } finally {
      closeDeleteModal();
    }
  };

  const filteredEstablishments = establishments.filter(est =>
    est.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando establecimientos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
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
                ¿Eliminar establecimiento?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                ¿Estás seguro de eliminar el establecimiento <span className="font-semibold">"{deleteModal.establishmentName}"</span>?
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
          <h1 className="text-3xl font-bold text-gray-900">Establecimientos</h1>
          <p className="text-gray-600 mt-2">Gestiona los establecimientos disponibles para eventos</p>
        </div>
        <Link
          to="/admin/establishments/create"
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <span className="mr-2">➕</span>
          Nuevo Establecimiento
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Lista de Establecimientos con scroll */}
      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden flex flex-col">
        {filteredEstablishments.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {establishments.length === 0 ? "No hay establecimientos creados" : "No se encontraron establecimientos"}
            </h3>
            <p className="text-gray-500 mb-4">
              {establishments.length === 0 
                ? "Comienza creando tu primer establecimiento" 
                : "Intenta con otro término de búsqueda"}
            </p>
            {establishments.length === 0 && (
              <Link
                to="/admin/establishments/create"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Crear Primer Establecimiento
              </Link>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[250px]">
                    Dirección
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEstablishments.map(est => (
                  <tr key={est.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 text-lg">{est.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-700">{est.address}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-700">{est.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <Link
                          to={`/admin/establishments/edit/${est.id}`}
                          state={{ establishment: est }}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                          <span className="mr-2">✏️</span>
                          Editar
                        </Link>
                        <button
                          onClick={() => openDeleteModal(est.id, est.name)}
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
        <span className="font-medium">{filteredEstablishments.length}</span> de <span className="font-medium">{establishments.length}</span> establecimientos mostrados
        {searchTerm && filteredEstablishments.length > 0 && (
          <span className="ml-2 text-purple-600">
            (filtrado por: "{searchTerm}")
          </span>
        )}
      </div>
    </div>
  );
}