import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [stats, setStats] = useState({
    establishments: 0,
    events: 0,
    entertainment: 0,
    decoration: 0,
    catering: 0,
    additionalServices: 0,
    reservations: 0,
    users: 0,
    revenue: 0
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/sign-in");
      return;
    }
    
    if (user?.type !== "ADMIN") {
      toast.error("No tienes permisos para acceder a esta página");
      navigate("/");
      return;
    }

    loadDashboardData();
  }, [user, isAuthenticated, navigate]);

  const loadDashboardData = async () => {
    // Simular carga de datos
    setTimeout(() => {
      setStats({
        establishments: 12,
        events: 8,
        entertainment: 15,
        decoration: 10,
        catering: 8,
        additionalServices: 12,
        reservations: 45,
        users: 120,
        revenue: 15200
      });
      setLoading(false);
    }, 500);
  };

  // Calcular total de todos los servicios
  const totalServices = stats.entertainment + stats.decoration + stats.catering + stats.additionalServices;

  const statCards = [
    { 
      title: "Establecimientos", 
      value: stats.establishments, 
      icon: "🏢",
      color: "bg-blue-100 text-blue-800",
      change: "+2 este mes",
      link: "/admin/establishments"
    },
    { 
      title: "Eventos", 
      value: stats.events, 
      icon: "📅",
      color: "bg-purple-100 text-purple-800",
      change: "+1 este mes",
      link: "/admin/events"
    },
    { 
      title: "Reservas", 
      value: stats.reservations, 
      icon: "📋",
      color: "bg-green-100 text-green-800",
      change: "+5 este mes",
      link: "/admin/reservations"
    },
    { 
      title: "Total Servicios", 
      value: totalServices, 
      icon: "🔧",
      color: "bg-indigo-100 text-indigo-800",
      change: "+8 este mes",
      link: "/admin/all-services"
    },
  ];

  // Opciones para el desplegable de crear servicios
  const serviceCreateOptions = [
    { label: "Entretenimiento", link: "/admin/entertainment/create", icon: "🎭" },
    { label: "Decoración", link: "/admin/decoration/create", icon: "🎨" },
    { label: "Catering", link: "/admin/catering/create", icon: "🍽️" },
    { label: "Servicios Adicionales", link: "/admin/additional-services/create", icon: "🔧" },
  ];

  const quickActions = [
    { 
      title: "Crear Establecimiento", 
      description: "Agregar un nuevo lugar para eventos",
      link: "/admin/establishments/create",
      icon: "🏢"
    },
    { 
      title: "Crear Evento", 
      description: "Definir un nuevo tipo de evento",
      link: "/admin/events/create",
      icon: "🎉"
    },
    // Esta acción ahora será un desplegable
    { 
      title: "Crear Servicio", 
      description: "Entretenimiento, decoración, catering, etc.",
      icon: "🔧",
      isDropdown: true
    },
    { 
      title: "Ver Usuarios", 
      description: "Gestionar clientes y administradores",
      link: "/admin/users",
      icon: "👥"
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
  
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <Link 
                to={stat.link}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Ver →
              </Link>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-gray-700 font-medium">{stat.title}</p>
            <p className="text-sm text-green-600 mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="space-y-4 relative">
            {quickActions.map((action, index) => {
              if (action.isDropdown) {
                return (
                  <div key={index} className="relative">
                    <button
                      onClick={() => setShowServiceDropdown(!showServiceDropdown)}
                      className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-4 text-2xl">
                          {action.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{action.title}</h3>
                          <p className="text-sm text-gray-500">{action.description}</p>
                        </div>
                        <div className="ml-auto text-gray-400">
                          {showServiceDropdown ? '▲' : '▼'}
                        </div>
                      </div>
                    </button>
                    
                    {/* Desplegable de servicios */}
                    {showServiceDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                        {serviceCreateOptions.map((option, idx) => (
                          <Link
                            key={idx}
                            to={option.link}
                            className="flex items-center p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                            onClick={() => setShowServiceDropdown(false)}
                          >
                            <span className="mr-3 text-xl">{option.icon}</span>
                            <span className="text-gray-700">{option.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <Link
                    key={index}
                    to={action.link}
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-4 text-2xl">
                        {action.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-500">{action.description}</p>
                      </div>
                      <div className="ml-auto text-gray-400">
                        →
                      </div>
                    </div>
                  </Link>
                );
              }
            })}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Desglose de Servicios</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            {[
              { label: "Entretenimiento", value: stats.entertainment, max: 25, color: "bg-pink-500", link: "/admin/entertainment" },
              { label: "Decoración", value: stats.decoration, max: 20, color: "bg-yellow-500", link: "/admin/decoration" },
              { label: "Catering", value: stats.catering, max: 15, color: "bg-red-500", link: "/admin/catering" },
              { label: "Servicios Adicionales", value: stats.additionalServices, max: 10, color: "bg-indigo-500", link: "/admin/additional-services" },
            ].map((item, index) => (
              <Link to={item.link} key={index}>
                <div className="mb-4 p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{item.label}</span>
                    <span className="text-gray-600">{item.value} de {item.max}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${(item.value / item.max) * 100}%` }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}