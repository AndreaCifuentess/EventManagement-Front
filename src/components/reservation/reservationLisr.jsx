import { useState } from 'react';
import ReservationCard from './reservationCard';

export default function ReservationList({ reservations, title = "Mis Reservas", showUserInfo = false }) {
  const [filter, setFilter] = useState('all');

  // Filtrar reservas
  const filteredReservations = reservations.filter(reservation => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') {
      const today = new Date();
      const reservationDate = reservation.dates?.[0] || reservation.date;
      try {
        return reservationDate && new Date(reservationDate) >= today;
      } catch (e) {
            console.error("Error filtering upcoming reservations:", e);
        return false;
      }
    }
    return reservation.status === filter;
  });

  // Estadísticas
  const stats = {
    total: reservations.length,
    upcoming: reservations.filter(r => {
      const today = new Date();
      const date = r.dates?.[0] || r.date;
      try {
        return date && new Date(date) >= today;
      } catch (e) {
            console.error("Error calculating upcoming reservations:", e);
        return false;
      }
    }).length,
    pending: reservations.filter(r => r.status === 'PENDING').length,
    completed: reservations.filter(r => r.status === 'COMPLETED').length,
    cancelled: reservations.filter(r => r.status === 'CANCELLED').length,
  };

  return (
    <div>
      {/* Header con filtros */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <div className="text-sm text-gray-600">
            Mostrando {filteredReservations.length} de {reservations.length} reservas
          </div>
        </div>
        
        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Todas ({stats.total})
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-lg ${filter === 'upcoming' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Próximas ({stats.upcoming})
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-4 py-2 rounded-lg ${filter === 'PENDING' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Pendientes ({stats.pending})
          </button>
          <button
            onClick={() => setFilter('COMPLETED')}
            className={`px-4 py-2 rounded-lg ${filter === 'COMPLETED' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Completadas ({stats.completed})
          </button>
          <button
            onClick={() => setFilter('CANCELLED')}
            className={`px-4 py-2 rounded-lg ${filter === 'CANCELLED' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Canceladas ({stats.cancelled})
          </button>
        </div>
      </div>

      {/* Lista de reservas */}
      {filteredReservations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No hay reservas {filter !== 'all' ? `con filtro "${filter}"` : ''}
          </h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? "Aún no tienes reservas en el sistema." 
              : "Intenta con otro filtro o crea una nueva reserva."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredReservations.map(reservation => (
            <ReservationCard 
              key={reservation.id} 
              reservation={reservation} 
              showUserInfo={showUserInfo}
            />
          ))}
        </div>
      )}
    </div>
  );
}