import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDecorations, deleteDecoration } from "../../../api/decoration";
import useSnackbar from "../../../hooks/useSnackbar";

export default function DecorationList() {
  const [decorations, setDecorations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    decorationId: null,
    articles: "",
  });
  const { showSnackbar, SnackbarComponent } = useSnackbar();

  useEffect(() => {
    loadDecorations();
  }, []);

  const loadDecorations = async () => {
    try {
      const data = await getDecorations();
      setDecorations(data);
    } catch (error) {
      showSnackbar("Error al cargar las decoraciones", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id, articles) => {
    setDeleteModal({
      show: true,
      decorationId: id,
      articles: articles,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      show: false,
      decorationId: null,
      articles: "",
    });
  };
  
  const confirmDelete = async () => {
    if (!deleteModal.decorationId) return;
    try {
      await deleteDecoration(deleteModal.decorationId);
      setDecorations(decorations.filter(item => item.id !== deleteModal.decorationId));
      showSnackbar(`Decoración "${deleteModal.articles}" eliminada correctamente`, "success");
    } catch (error) {
      let errorMessage = "Error al eliminar la decoración";
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || error.response.data.error || errorMessage;
      }
      showSnackbar(errorMessage, "error");
    } finally {
      closeDeleteModal();
    }
  };

  const filteredDecorations = decorations.filter(item =>
    item.articles?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Formatear costo en pesos colombianos (COP)
  const formatCost = (cost) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(cost);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando decoraciones...</p>
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
                ¿Eliminar decoración?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                ¿Estás seguro de eliminar la decoración <span className="font-semibold">"{deleteModal.articles}"</span>?
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
          <h1 className="text-3xl font-bold text-gray-900">Decoraciones</h1>
          <p className="text-gray-600 mt-2">Gestiona las decoraciones para eventos</p>
        </div>
        <Link
          to="/admin/decoration/create"
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <span className="mr-2">➕</span>
          Nueva Decoración
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por artículos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden flex flex-col">
        {filteredDecorations.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {decorations.length === 0 ? "No hay decoraciones" : "No se encontraron decoraciones"}
            </h3>
            <p className="text-gray-500 mb-4">
              {decorations.length === 0 
                ? "Comienza creando tu primera decoración" 
                : "Intenta con otro término de búsqueda"}
            </p>
            {decorations.length === 0 && (
              <Link
                to="/admin/decoration/create"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Crear Primera Decoración
              </Link>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                    Artículos
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
                {filteredDecorations.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{item.articles}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-green-600">
                        {formatCost(item.cost)}
                      </div>
                      <div className="text-sm text-gray-500">en pesos colombianos</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <Link
                          to={`/admin/decoration/edit/${item.id}`}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                          <span className="mr-2">✏️</span>
                          Editar
                        </Link>
                        <button
                          onClick={() => openDeleteModal(item.id, item.articles)}
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
        <span className="font-medium">{filteredDecorations.length}</span> de <span className="font-medium">{decorations.length}</span> decoraciones mostradas
        {searchTerm && filteredDecorations.length > 0 && (
          <span className="ml-2 text-purple-600">
            (filtrado por: "{searchTerm}")
          </span>
        )}
      </div>
    </div>
  );
}