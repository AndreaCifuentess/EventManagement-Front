import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'; 
export default function AdminLayout() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', exact: true, icon: '📊' },
    { path: '/admin/establishments', label: 'Establecimientos', icon: '🏢' },
    { path: '/admin/events', label: 'Eventos', icon: '📅' },
    { path: '/admin/entertainment', label: 'Entretenimiento', icon: '🎭' },
    { path: '/admin/catering', label: 'Catering', icon: '🍽️' },
    { path: '/admin/services', label: 'Servicios', icon: '🔧' },
    { path: '/admin/users', label: 'Usuarios', icon: '👥' },
  ];

  const quickCreateItems = [
    { path: '/admin/establishments/create', label: 'Establecimiento', icon: '🏢' },
    { path: '/admin/events/create', label: 'Evento', icon: '📅' },
    { path: '/admin/entertainment/create', label: 'Entretenimiento', icon: '🎭' },
    { path: '/admin/catering/create', label: 'Catering', icon: '🍽️' },
    { path: '/admin/services/create', label: 'Servicio', icon: '🔧' },
  ];

  // Verificar si el usuario está autenticado
  if (!user) {
    // Redirigir al login si no está autenticado
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
              <p className="text-xs text-gray-500">Bienvenido, {user?.fullName || user?.email?.split('@')[0] || 'Admin'}</p>
            </div>
          </div>
        </div>

        {/* Quick Create */}
        <div className="p-4 border-b border-gray-200">
          <div className="mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase">Crear Rápido</span>
          </div>
          <div className="space-y-1">
            {quickCreateItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive
                      ? 'bg-purple-50 text-purple-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="p-4 flex-1">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span className="text-lg">🏠</span>
            <span className="text-sm">Ir al Sitio</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Panel de Administración
              </h2>
              <p className="text-sm text-gray-500">
                Gestiona todos los aspectos de tu plataforma
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span>🏠</span>
                Ver Sitio Web
              </button>
              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-gray-700">
                    {user?.fullName || user?.email?.split('@')[0] || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email || ''}</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}