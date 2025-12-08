// src/pages/CategoryServices.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getCatering, getEntertainments, getDecorations, getAdditionals } from '../api/services'; 

export default function CategoryServices() {
  const { categoryId } = useParams();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryInfo, setCategoryInfo] = useState(null);

  // Mapeo de categorías con información
  const categoryMap = {
    entretenimiento: {
      title: "Entretenimiento",
      function: getEntertainments,
      description: "Música, shows y animación para tu evento",
      icon: "🎭",
      color: "purple",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-800"
    },
    decoracion: {
      title: "Decoración", 
      function: getDecorations,
      description: "Ambientación y decoración personalizada",
      icon: "🎨",
      color: "blue",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800"
    },
    catering: {
      title: "Catering",
      function: getCatering,
      description: "Banquete y servicio de alimentos",
      icon: "🍽️",
      color: "green",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-800"
    },
    adicionales: {
      title: "Servicios Adicionales",
      function: getAdditionals,
      description: "Servicios complementarios",
      icon: "➕",
      color: "yellow",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-800"
    }
  };

  useEffect(() => {
    const fetchServicesByCategory = async () => {
      if (!categoryId || !categoryMap[categoryId]) {
        toast.error("Categoría no válida");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const category = categoryMap[categoryId];
        setCategoryInfo(category);

        const response = await category.function();
        
        // Normalizar los datos según la categoría
        let normalizedServices = [];
        
        if (categoryId === "entretenimiento" || categoryId === "catering") {
          normalizedServices = Array.isArray(response) ? response : [];
        } 
        else if (categoryId === "decoracion") {
          if (Array.isArray(response)) {
            normalizedServices = response;
          } else if (response && typeof response === 'object') {
            normalizedServices = [response];
          } else {
            normalizedServices = [];
          }
        }
        else if (categoryId === "adicionales") {
          if (response && response.additionalServices && Array.isArray(response.additionalServices)) {
            normalizedServices = response.additionalServices;
          } else if (Array.isArray(response)) {
            normalizedServices = response;
          } else {
            normalizedServices = [];
          }
        }
        
        setServices(normalizedServices);
        
      } catch (error) {
        console.error("Error al cargar servicios:", error);
        toast.error(`No se pudieron cargar los servicios de ${categoryMap[categoryId]?.title}`);
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServicesByCategory();
  }, [categoryId]);

  // Función para obtener el costo según la categoría
  const getServiceCost = (service) => {
    switch(categoryId) {
      case "entretenimiento":
        return service.hourlyRate;
      case "decoracion":
        return service.cost;
      case "catering":
        return service.costDish;
      case "adicionales":
        return  service.cost;
      default:
        return 0;
    }
  };

  // Función para renderizar servicios
  const renderServiceCard = (service, index) => {
    const category = categoryMap[categoryId];
    const serviceCost = getServiceCost(service);
    
    return (
      <div 
        key={service.id || `service-${index}`}
        className={`group relative ${category.bgColor} rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${category.borderColor} border-2`}
      >
        {/* Cabecera de la tarjeta con icono y título */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${category.textColor} bg-white shadow-md`}>
                <span className="text-2xl">{category.icon}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {service.name || service.theme || service.menuType || "Servicio"}
                </h3>
                <div className={`inline-block ${category.textColor} text-xs font-medium px-2 py-1 rounded-full mt-1 bg-white/70`}>
                  {category.title}
                </div>
              </div>
            </div>
            
          </div>

          {/* Información específica del servicio */}
          <div className="space-y-4 mb-6">
            {renderServiceDetails(service)}
          </div>

          {/* Precio y botón de acción */}
          <div className="flex justify-between items-center pt-6 border-t border-white/50">
            <div>
              <p className="text-3xl font-bold text-gray-800">
                ${serviceCost || "Consultar"}
              </p>
              <p className="text-sm text-gray-500">Costo del servicio</p>
            </div>
            
              <Link
              to={`/reserve/${service.id}`}
              state={{ 
                category: categoryId,
                serviceName: service.name || service.theme || service.menuType,
                serviceCost: getServiceCost(service)
              }}
              className={`bg-white ${category.textColor} font-medium px-6 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 border-2 ${category.borderColor}`}
            >
              Reservar
            </Link>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar detalles específicos por categoría
  const renderServiceDetails = (service) => {
    switch(categoryId) {
      case "entretenimiento":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tipo</p>
                <p className="font-medium text-gray-800">{service.type || "No especificado"}</p>
              </div>
              {service.hours && (
                <div className="text-right">
                  <p className="text-sm text-gray-500">Duración</p>
                  <p className="font-medium text-gray-800">{service.hours} horas</p>
                </div>
              )}
            </div>
            
            {service.description && (
              <div className="bg-white/70 p-4 rounded-xl">
                <p className="text-gray-600">{service.description}</p>
              </div>
            )}
          </div>
        );
      
      case "decoracion":
        return (
          <div className="space-y-3">
            {service.theme && (
              <div>
                <p className="text-sm text-gray-500">Temática</p>
                <p className="font-medium text-gray-800">{service.theme}</p>
              </div>
            )}
            
            <div>
              <p className="text-sm text-gray-500 mb-2">Artículos incluidos</p>
              <div className="bg-white/70 p-4 rounded-xl">
                <p className="text-gray-600">
                  {service.articles || "Globos, manteles, decoración temática"}
                </p>
              </div>
            </div>
          </div>
        );
      
      case "catering":
        return (
          <div className="space-y-3">
            {service.menuType && (
              <div>
                <p className="text-sm text-gray-500">Tipo de menú</p>
                <p className="font-medium text-gray-800">{service.menuType}</p>
              </div>
            )}
            
            <div>
              <p className="text-sm text-gray-500 mb-2">Descripción</p>
              <p className="text-gray-600">
                {service.description || "Servicio de catering completo para tu evento"}
              </p>
            </div>
            
            {service.numberDish && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/70 p-3 rounded-xl text-center">
                  <p className="text-sm text-gray-500">Número de platos</p>
                  <p className="text-xl font-bold text-gray-800">{service.numberDish}</p>
                </div>
                
                <div className="bg-white/70 p-3 rounded-xl text-center">
                  <p className="text-sm text-gray-500">Para personas</p>
                  <p className="text-xl font-bold text-gray-800">{service.numberDish}</p>
                </div>
              </div>
            )}
          </div>
        );
      
      case "adicionales":
        return (
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500 mb-2">Descripción</p>
              <p className="text-gray-600">
                {service.description || "Descripción del servicio adicional"}
              </p>
            </div>
            
            {service.quantity && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Cantidad</p>
                  <p className="font-medium text-gray-800">{service.quantity} unidades</p>
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  // Estado de carga
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-12">
            <div className="h-8 bg-gray-200 rounded-lg w-1/4 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-1/2 mb-6 animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-6"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-screen-xl mx-auto">
        {/* Header simplificado */}
        <div className="mb-10">
          <Link 
            to="/services" 
            className="inline-flex items-center text-gray-600 hover:text-purple-600 mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            Volver a categorías
          </Link>
          
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-xl ${categoryInfo?.textColor} bg-white shadow-md`}>
                <span className="text-2xl">{categoryInfo?.icon}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {categoryInfo?.title || "Categoría"}
                </h1>
                <p className="text-gray-600">
                  {categoryInfo?.description || "Explora nuestros servicios"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-gray-500">
                {services.length} {services.length === 1 ? 'servicio disponible' : 'servicios disponibles'}
              </p>
              
              {/* Filtros o ordenación (puedes agregar después) */}
              <div className="text-sm text-gray-500">
                Ordenar por: <span className="font-medium text-gray-700">Relevancia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de servicios */}
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => 
              renderServiceCard(service, index)
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-8 text-gray-300">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              No hay servicios disponibles
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              En este momento no contamos con servicios en esta categoría. 
              Te notificaremos cuando agreguemos nuevas opciones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/services"
                className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors font-medium"
              >
                Ver otras categorías
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors font-medium"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}