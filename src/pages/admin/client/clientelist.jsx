import { useState, useEffect } from "react";
import { getUsersByType } from "../../../api/user";
import useSnackbar from "../../../hooks/useSnackbar";

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { showSnackbar, SnackbarComponent } = useSnackbar();

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
     setLoading(true);
      const clientsData = await getUsersByType('CLIENTE');
      setClients(clientsData || []);
    } catch (error) {
      showSnackbar("Error al cargar los clientes", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

const filteredClients = clients.filter(client =>
    (client.fullName && client.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.phone && client.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.city && client.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Obtener iniciales para avatar
  const getInitials = (name) => {
    if (!name) return "CL";
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Calcular estadísticas de reservas
  const calculateBookingStats = (client) => {
    const scheduled = client.scheduledBookings?.length || 0;
    const completed = client.completedBookings?.length || 0;
    const cancelled = client.cancelledBookings?.length || 0;
    const total = scheduled + completed + cancelled;
    
    return { scheduled, completed, cancelled, total };
  };

  // Formatear tipo de usuario
  const formatUserType = (type) => {
    const typeMap = {
      'CLIENTE': 'Cliente',
      'ADMIN': 'Administrador',
    };
    return typeMap[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <SnackbarComponent position="bottom" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-2">Gestión de usuarios tipo CLIENTE en la plataforma</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={loadClients}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            title="Recargar lista"
          >
            <span className="mr-2">🔄</span>
            Actualizar
          </button>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar cliente por nombre, email, teléfono o ciudad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
          />
          <span className="absolute left-4 top-3.5 text-gray-400 text-xl">🔍</span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className="flex-1 bg-white rounded-xl shadow overflow-hidden flex flex-col">
        {filteredClients.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">👤</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {clients.length === 0 ? "No hay clientes registrados" : "No se encontraron clientes"}
            </h3>
            <p className="text-gray-500 text-center mb-4 max-w-md">
              {clients.length === 0 
                ? 'No se encontraron usuarios con tipo "CLIENTE" en el sistema.'
                : `No hay clientes que coincidan con "${searchTerm}".`}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Información de Contacto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estadísticas
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredClients.map(client => {
                  const stats = calculateBookingStats(client);
                  
                  return (
                    <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                      {/* Información del Cliente */}
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg mr-4">
                            {getInitials(client.fullName)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {client.fullName || 'Sin nombre'}
                            </div>
                            <div className="text-xs mt-1">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                {formatUserType(client.type)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Información de Contacto */}
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <span className="text-gray-400 mr-2">✉️</span>
                            <a 
                              href={`mailto:${client.email}`}
                              className="text-gray-900 hover:text-blue-600 hover:underline"
                            >
                              {client.email}
                            </a>
                          </div>
                          {client.phone && (
                            <div className="flex items-center">
                              <span className="text-gray-400 mr-2">📞</span>
                              <span className="text-gray-700">{client.phone}</span>
                            </div>
                          )}
                          {client.city && (
                            <div className="flex items-center">
                              <span className="text-gray-400 mr-2">🏙️</span>
                              <span className="text-gray-700">{client.city}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      
                      {/* Estadísticas de Reservas */}
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-center p-2 bg-green-50 rounded-lg">
                              <div className="text-lg font-bold text-green-700">{stats.scheduled}</div>
                              <div className="text-xs text-green-600">Programadas</div>
                            </div>
                            <div className="text-center p-2 bg-blue-50 rounded-lg">
                              <div className="text-lg font-bold text-blue-700">{stats.completed}</div>
                              <div className="text-xs text-blue-600">Completadas</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-center p-2 bg-red-50 rounded-lg">
                              <div className="text-lg font-bold text-red-700">{stats.cancelled}</div>
                              <div className="text-xs text-red-600">Canceladas</div>
                            </div>
                            <div className="text-center p-2 bg-purple-50 rounded-lg">
                              <div className="text-lg font-bold text-purple-700">{stats.total}</div>
                              <div className="text-xs text-purple-600">Total</div>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Acciones */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => {
                              // Ver detalles del cliente
                              console.log('Ver pagos del cliente:', client.id);
                            }}
                            className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <span className="mr-2">👁️</span>
                            Ver Pagos
                          </button>
                          <button
                            onClick={() => {
                              // Ver reservas del cliente
                              console.log('Ver reservas del cliente:', client.id);
                            }}
                            className="inline-flex items-center justify-center px-3 py-2 border border-blue-500 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            <span className="mr-2">📅</span>
                            Ver Reservas
                          </button>
                          <button
                            onClick={() => {
                              // Enviar mensaje
                              window.location.href = `mailto:${client.email}?subject=Contacto desde Reserva de Eventos`;
                            }}
                            className="inline-flex items-center justify-center px-3 py-2 border border-green-500 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
                          >
                            <span className="mr-2">✉️</span>
                            Contactar
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
      <div className="mt-6 p-4 bg-white rounded-xl shadow border flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{filteredClients.length}</span> de <span className="font-medium">{clients.length}</span> clientes mostrados
          {searchTerm && (
            <span className="ml-2 text-purple-600">
              (filtrado por: "{searchTerm}")
            </span>
          )}
        </div>
      </div>
    </div>
  );
}