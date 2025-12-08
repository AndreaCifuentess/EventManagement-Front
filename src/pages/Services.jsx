// src/pages/Services.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../api/axios";


export default function Services() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [setError] = useState(null);

  // Definir las categorías fijas (siempre son las mismas)
  const serviceCategories = [
    {
      id: "entretenimiento",
      title: "Entretenimiento",
      description: "Música, shows, animación y diversión para tu evento",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop",
      endpoint: "/entertainment"
    },
    {
      id: "decoracion",
      title: "Decoración",
      description: "Ambientación, temáticas y decoración personalizada",
      image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop",
      endpoint: "/decoration"
    },
    {
      id: "catering",
      title: "Catering",
      description: "Banquete, bocadillos, bebidas y servicio de alimentos",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w-400&h=300&fit=crop",
      endpoint: "/catering"
    },
    {
      id: "adicionales",
      title: "Servicios Adicionales",
      description: "Fotografía, transporte, mobiliario y más",
      image: "https://images.unsplash.com/photo-1529408632839-a54952c491e5?w=400&h=300&fit=crop",
      endpoint: "/additional"
    }
  ];

  useEffect(() => {
    // Opcional: Si quieres verificar que cada categoría tenga servicios disponibles
    const verifyCategories = async () => {
      try {
        setIsLoading(true);
        
        // Verificar cada categoría (opcional - para mostrar conteo)
        const categoriesWithCount = await Promise.all(
          serviceCategories.map(async (category) => {
            try {
              const response = await api.get(category.endpoint);
              const servicesCount = response.data?.length || 0;
              return {
                ...category,
                servicesCount,
                isAvailable: servicesCount > 0
              };
            } catch (err) {
              console.error(`Error en categoría ${category.title}:`, err);
              return {
                ...category,
                servicesCount: 0,
                isAvailable: false
              };
            }
          })
        );
        
        setCategories(categoriesWithCount);
        
      } catch (error) {
        console.error("Error verificando categorías:", error);
        setError("No se pudieron cargar las categorías");
        toast.error("Error al cargar categorías");
        
        // Si hay error, mostrar las categorías sin verificar
        setCategories(serviceCategories.map(cat => ({ ...cat, servicesCount: 0, isAvailable: true })));
      } finally {
        setIsLoading(false);
      }
    };

    verifyCategories();
  }, []);

  // Estado de carga
  if (isLoading) {
    return (
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10 sm:py-20 font-sans">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl text-black font-semibold font-satisfy">
            Nuestros Servicios
          </h2>
          <p className="text-gray-600 mt-2">Selecciona una categoría para explorar</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10 sm:py-20 font-sans">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl text-black font-semibold font-satisfy">
          Nuestros Servicios
        </h2>
        <p className="text-gray-600 mt-2">Selecciona una categoría para explorar</p>
      </div>

      {/* Grid de Categorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            {/* Imagen de la categoría */}
            <div className="h-48 overflow-hidden">
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Contenido de la tarjeta */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2 font-poppins">
                {category.title}
              </h3>
              
              <p className="text-gray-600 mb-4 text-sm">
                {category.description}
              </p>
              
              {/* Contador de servicios (opcional) */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">
                  {category.servicesCount > 0 
                    ? `${category.servicesCount} servicios disponibles`
                    : "Cargando servicios..."
                  }
                </span>
                
                {!category.isAvailable && (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                    Temporalmente no disponible
                  </span>
                )}
              </div>

              {/* Botón para ver servicios de esta categoría */}
              <Link
                to={`/services/${category.id}`}
                className={`w-full block text-center ${
                  category.isAvailable 
                    ? "bg-black text-white hover:bg-gray-800" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } px-4 py-3 rounded-lg font-medium transition-colors duration-300`}
                onClick={(e) => !category.isAvailable && e.preventDefault()}
              >
                {category.isAvailable ? "Ver Servicios" : "No Disponible"}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Sección informativa */}
      <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          ¿Cómo funciona?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 font-bold">1</span>
            </div>
            <h4 className="font-semibold mb-2">Elige una categoría</h4>
            <p className="text-sm text-gray-600">Selecciona el tipo de servicio que necesitas</p>
          </div>
          <div className="p-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 font-bold">2</span>
            </div>
            <h4 className="font-semibold mb-2">Explora opciones</h4>
            <p className="text-sm text-gray-600">Revisa todos los servicios disponibles</p>
          </div>
          <div className="p-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 font-bold">3</span>
            </div>
            <h4 className="font-semibold mb-2">Personaliza y reserva</h4>
            <p className="text-sm text-gray-600">Selecciona y personaliza tu servicio ideal</p>
          </div>
        </div>
      </div>
    </section>
  );
}