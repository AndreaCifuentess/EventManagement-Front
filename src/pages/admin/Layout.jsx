import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext'; 

export default function AdminLayout() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [servicesOpen, setServicesOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [createServiceOpen, setCreateServiceOpen] = useState(false); 
  // Definir las categorías de servicios
  const serviceCategories = [
    { 
      path: '/admin/entertainment', 
      label: 'Entretenimiento', 
      icon: '🎭',
      createPath: '/admin/entertainment/create'
    },
    { 
      path: '/admin/decoration', 
      label: 'Decoración', 
      icon: '🎨',
      createPath: '/admin/decoration/create'
    },
    { 
      path: '/admin/catering', 
      label: 'Catering', 
      icon: '🍽️',
      createPath: '/admin/catering/create'
    },
    { 
    path: '/admin/additionals',  
    label: 'Servicios Adicionales', 
    icon: '🔧',
    createPath: '/admin/additionals/create'  
  },   
  ];

  // Elementos principales del menú
  const mainNavItems = [
    { path: '/admin/dashboard', label: 'Dashboard', exact: true, icon: '📊' },
    { path: '/admin/establishments', label: 'Establecimientos', icon: '🏢' },
    { path: '/admin/events', label: 'Eventos', icon: '📅' },
    { path: '/admin/clients', label: 'Clientes', icon: '👥' },
  ];

  // Elementos para creación rápida (sin servicios individuales)
  const quickCreateItems = [
    { path: '/admin/establishments/create', label: 'Establecimiento', icon: '🏢' },
    { path: '/admin/events/create', label: 'Evento', icon: '📅' },
  ];

  // Verificar si el usuario está autenticado
  if (!user) {
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
            <button
                onClick={() => navigate('/')}
                className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span>🏠</span>
                Ver Sitio Web
              </button>
          </div>
        </div>
        <div className="p-4 border-b border-gray-200">
          <div className="mb-2">
            <button 
              onClick={() => setQuickCreateOpen(!quickCreateOpen)}
              className="w-full flex items-center justify-between hover:text-gray-700"
            >
              <span className="text-xs font-semibold text-gray-500 uppercase">Crear Rápido</span>
              <span className="text-gray-400 text-xs">{quickCreateOpen ? '▲' : '▼'}</span>
            </button>
          </div>
          {quickCreateOpen && (
            <div className="space-y-1 mt-2">
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

              <div className="mt-1">
                <button
                  onClick={() => setCreateServiceOpen(!createServiceOpen)}
                  className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔧</span>
                    <span>Servicios</span>
                  </div>
                  <span className={`transform transition-transform ${createServiceOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                
                {createServiceOpen && (
                  <div className="ml-6 mt-1 space-y-1">
                    {serviceCategories.map((category) => (
                      <NavLink
                        key={category.createPath}
                        to={category.createPath}
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-1 text-sm rounded-md transition-colors ${
                            isActive
                              ? 'bg-purple-50 text-purple-600'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`
                        }
                      >
                        <span className="text-base">{category.icon}</span>
                        <span>Crear {category.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <nav className="p-4 flex-1">
          <div className="space-y-1">
            {mainNavItems.map((item) => (
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
            
        
            
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-colors ${
                  servicesOpen
                    ? 'bg-purple-50 text-purple-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">🔧</span>
                  <span className="text-sm font-medium">Servicios</span>
                </div>
                <span className={`transform transition-transform ${servicesOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
             
              {servicesOpen && (
                <div className="ml-8 mt-1 space-y-1 bg-gray-50 rounded-lg p-2">
                  {serviceCategories.map((category) => (
                    <NavLink
                      key={category.path}
                      to={category.path}
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                          isActive
                            ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-600'
                            : 'text-gray-600 hover:bg-gray-200'
                        }`
                      }
                    >
                      <span className="text-base">{category.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium">{category.label}</div>
                      </div>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
        </nav>
      </div>

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