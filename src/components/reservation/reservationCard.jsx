import { Link } from 'react-router-dom';

export default function ReservationCard({ reservation, showUserInfo = false }) {
  // Formatear fecha sin date-fns
  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no definida";
    try {
      const date = new Date(dateString);
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return date.toLocaleDateString('es-ES', options);
    } catch (e) {
        console.error("Error formatting date:", e);
      return dateString;
    }
  };

  // Formatear fecha corta
  const formatShortDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
        console.error("Error formatting short date:", e);
      return "";
    }
  };

  // Obtener color según estado
  const getStatusColor = (status) => {
    const statusMap = {
      'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'CONFIRMED': 'bg-green-100 text-green-800 border-green-300',
      'COMPLETED': 'bg-blue-100 text-blue-800 border-blue-300',
      'CANCELLED': 'bg-red-100 text-red-800 border-red-300',
      'ACTIVE': 'bg-purple-100 text-purple-800 border-purple-300',
    };
    return statusMap[status?.toUpperCase()] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  // Formatear texto del estado
  const formatStatus = (status) => {
    const statusMap = {
      'PENDING': 'Pendiente',
      'CONFIRMED': 'Confirmada',
      'COMPLETED': 'Completada',
      'CANCELLED': 'Cancelada',
      'ACTIVE': 'Activa',
    };
    return statusMap[status?.toUpperCase()] || status || 'Desconocido';
  };

  
  const isUpcoming = () => {
    try {
      const today = new Date();
      const reservationDate = reservation.dates?.[0] || reservation.date;
      if (!reservationDate) return false;
      return new Date(reservationDate) > today;
    } catch (e) {
        console.error("Error determining if reservation is upcoming:", e);
      return false;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-gray-900">
              {reservation.event?.name || reservation.establishment?.name || 'Reserva'}
            </h3>
            {isUpcoming() && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                Próxima
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
              {formatStatus(reservation.status)}
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xl font-bold text-green-600">
            ${(reservation.totalCost || reservation.total || 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Costo total</div>
        </div>
      </div>

      {/* Información principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Fechas</p>
          <p className="font-medium">
            {reservation.dates?.length > 0 
              ? reservation.dates.map(date => formatShortDate(date)).join(', ')
              : formatDate(reservation.date)}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Establecimiento</p>
          <p className="font-medium">
            {reservation.establishment?.name || 'No especificado'}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Tipo de evento</p>
          <p className="font-medium">
            {reservation.event?.type || reservation.eventType || 'No especificado'}
          </p>
        </div>
      </div>

      {/* Información del usuario (solo para admin) */}
      {showUserInfo && reservation.user && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Cliente</p>
          <div className="flex items-center mt-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm mr-2">
              {reservation.user.fullName?.charAt(0) || 'C'}
            </div>
            <div>
              <p className="font-medium">{reservation.user.fullName}</p>
              <p className="text-sm text-gray-500">{reservation.user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Servicios */}
    <div className="border-t pt-4">
      <h4 className="font-semibold text-gray-800 mb-2">Servicios contratados</h4>
      <div className="flex flex-wrap gap-2">
        {reservation.services ? (
          <>
        {/* Decoración */}
        {reservation.services.decoration && reservation.services.decoration.id && (
          <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">
            Decoración
          </span>
        )}
        
        {/* Entretenimiento */}
        {reservation.services.entertainment && 
         Array.isArray(reservation.services.entertainment) &&
         reservation.services.entertainment.length > 0 && (
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
            Entretenimiento ({reservation.services.entertainment.length})
          </span>
        )}
        
        {/* Catering */}
        {reservation.services.catering && 
         Array.isArray(reservation.services.catering) &&
         reservation.services.catering.length > 0 && (
          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium">
            Catering ({reservation.services.catering.length})
          </span>
        )}
        
        {/* Servicios adicionales */}
            {reservation.services.additionalServices && 
            Array.isArray(reservation.services.additionalServices) &&
            reservation.services.additionalServices.length > 0 && (
              <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-lg text-xs font-medium">
                Adicionales ({reservation.services.additionalServices.length})
              </span>
            )}
            
            {/* Si no hay servicios */}
            {!reservation.services.decoration?.id &&
            !reservation.services.entertainment?.length &&
            !reservation.services.catering?.length &&
            !reservation.services.additionalServices?.length && (
              <p className="text-gray-500 text-sm">No hay servicios especificados</p>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-sm">No hay servicios especificados</p>
        )}
      </div>
    </div>

      {/* Acciones */}
      <div className="border-t pt-4 mt-4 flex justify-end space-x-3">
        <Link
          to={`/reservations/${reservation.id}`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Ver detalles
        </Link>
        {reservation.status === 'PENDING' && (
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
            Confirmar
          </button>
        )}
      </div>
    </div>
  );
}