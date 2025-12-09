import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAdditionals, deleteAdditional } from "../../../api/additional";
import useSnackbar from "../../../hooks/useSnackbar";

export default function AdditionalList() {
  const [additionals, setAdditionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    additionalId: null,
    name: "",
  });
  const { showSnackbar, SnackbarComponent } = useSnackbar();

  useEffect(() => {
    loadAdditionals();
  }, []);

  const loadAdditionals = async () => {
    try {
      const data = await getAdditionals();
      setAdditionals(data);
    } catch (error) {
      showSnackbar("Error al cargar los adicionales", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id, name) => {
    setDeleteModal({
      show: true,
      additionalId: id,
      name: name,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      show: false,
      additionalId: null,
      name: "",
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.additionalId) return;
    try {
      await deleteAdditional(deleteModal.additionalId);
      setAdditionals(additionals.filter(item => item.id !== deleteModal.additionalId));
      showSnackbar(`Adicional "${deleteModal.name}" eliminado correctamente`, "success");
    } catch (error) {
      let errorMessage = "Error al eliminar el adicional";
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || error.response.data.error || errorMessage;
      }
      showSnackbar(errorMessage, "error");
    } finally {
      closeDeleteModal();
    }
  };

  const filteredAdditionals = additionals.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCost = (cost) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(cost);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando adicionales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <SnackbarComponent position="bottom" />
      
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <span className="text-2xl text-red-600">🗑️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                ¿Eliminar adicional?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                ¿Estás seguro de eliminar el adicional <span className="font-semibold">"{deleteModal.name}"</span>?
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

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Adicionales</h1>
          <p className="text-gray-600 mt-2">Gestiona los adicionales (extras, complementos, etc.)</p>
        </div>
        <Link
          to="/admin/additionals/create"
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <span className="mr-2">➕</span>
          Nuevo Adicional
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden flex flex-col">
        {filteredAdditionals.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {additionals.length === 0 ? "No hay adicionales" : "No se encontraron adicionales"}
            </h3>
            <p className="text-gray-500 mb-4">
              {additionals.length === 0 
                ? "Comienza creando tu primer adicional" 
                : "Intenta con otro término de búsqueda"}
            </p>
            {additionals.length === 0 && (
              <Link
                to="/admin/additionals/create"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Crear Primer Adicional
              </Link>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[300px]">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                    Costo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAdditionals.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{item.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-600">
                        {item.description ? (
                          <div className="line-clamp-2" title={item.description}>
                            {item.description}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Sin descripción</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-green-600">
                        {formatCost(item.cost)}
                      </div>
                      <div className="text-sm text-gray-500">costo unitario</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <Link
                          to={`/admin/additionals/edit/${item.id}`}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                          <span className="mr-2">✏️</span>
                          Editar
                        </Link>
                        <button
                          onClick={() => openDeleteModal(item.id, item.name)}
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

      <div className="mt-4 text-sm text-gray-600">
        <span className="font-medium">{filteredAdditionals.length}</span> de <span className="font-medium">{additionals.length}</span> adicionales mostrados
        {searchTerm && filteredAdditionals.length > 0 && (
          <span className="ml-2 text-purple-600">
            (filtrado por: "{searchTerm}")
          </span>
        )}
      </div>
    </div>
  );
}