import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../api/axios";

export default function ReservationForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { serviceId } = useParams();
  
  // Estado inicial con el servicio que viene de CategoryServices
  const [formData, setFormData] = useState({
    // Información del evento
    eventType: "",
    eventDate: "",
    eventTime: "",
    guests: "",
    comments: "",
    
    // Establecimiento
    establishmentId: "",
    
    // Servicios seleccionados (con nombre si viene de CategoryServices)
    selectedServices: serviceId && location.state?.category 
      ? [{ 
          id: serviceId, 
          category: location.state?.category,
          name: location.state?.serviceName || "Servicio", 
          cost: location.state?.serviceCost || 0
        }] 
      : [],
    
    // Servicios disponibles para agregar
    entertainmentServices: [],
    decorationServices: [],
    cateringServices: [],
    additionalServices: [],
  });
  
  const [establishments, setEstablishments] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCost, setTotalCost] = useState(0);

  // Tipos de evento
  const eventTypes = [
    "Boda", "Cumpleaños", "Aniversario", "Corporativo",
    "Graduación", "Baby Shower", "Fiesta Temática", "Otro"
  ];

  const getServiceCost = (service, category) => {
    switch(category) {
      case "entretenimiento":
        return service.hourlyRate;
      case "decoracion":
        return service.cost;
      case "catering":
        return service.costDish;
      case "adicionales":
        return service.cost;
      default:
        return 0;
    }
  };

  // Función para mostrar nombres amigables de categorías
  const getCategoryDisplayName = (category) => {
    const categoryNames = {
      entretenimiento: "Entretenimiento",
      decoracion: "Decoración",
      catering: "Catering", // Cambia a "Abastecimiento" si prefieres
      adicionales: "Servicios Adicionales"
    };
    return categoryNames[category] || category;
  };

  useEffect(() => {
    const loadFormData = async () => {
      try {
        setIsLoading(true);
        
        // 1. Cargar establecimientos
        const establishmentsRes = await api.get("/establishments");
        setEstablishments(establishmentsRes.data || []);
        
        // 2. Cargar servicios por categoría (para agregar más)
        const [entertainmentRes, decorationRes, cateringRes, additionalRes] = await Promise.all([
          api.get("/entertainment"),
          api.get("/decoration"),
          api.get("/catering"),
          api.get("/additional"),
        ]);
        
        setFormData(prev => ({
          ...prev,
          entertainmentServices: entertainmentRes.data || [],
          decorationServices: decorationRes.data || [],
          cateringServices: cateringRes.data || [],
          additionalServices: additionalRes.data?.additionalServices || [],
        }));
        
        // 3. Si venimos con un servicio pre-seleccionado, calcular costo
        if (serviceId && location.state?.category) {
          calculateTotal();
        }
        
      } catch (error) {
        console.error("Error cargando datos:", error);
        toast.error("Error al cargar datos del formulario");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFormData();
  }, [serviceId]);

  // Calcular costo total
   const calculateTotal = useCallback(() => {
    let total = 0;
    
    // Sumar costo de servicios seleccionados
   formData.selectedServices.forEach(service => {
      const cost = service.cost || getServiceCost(service, service.category) || 0;
      total += Number(cost) || 0;
    });
    
    // Agregar costo del establecimiento 
     if (formData.establishmentId && establishments.length > 0) {
    const selectedEstablishment = establishments.find(e => e.id === formData.establishmentId);
    if (selectedEstablishment?.cost) {
      console.log("💰 Sumando establecimiento:", selectedEstablishment.name, selectedEstablishment.cost);
      total += Number(selectedEstablishment.cost) || 0;
    }
  }
      setTotalCost(total);
  }, [formData.selectedServices, formData.establishmentId, establishments]);

  // Recalcular total cuando cambien los servicios o el establecimiento
  useEffect(() => {
    calculateTotal();
  }, [calculateTotal]);

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Agregar servicio
   const addService = (service, category) => {
    const cost = getServiceCost(service, category);
    setFormData(prev => ({
      ...prev,
      selectedServices: [...prev.selectedServices, { 
        ...service, 
        category,
        cost,
        name: service.name || service.theme || service.menuType
      }]
    }));
    
    // No necesitas setTimeout, el useEffect se encargará
  };

  // Remover servicio
  const removeService = (index) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.filter((_, i) => i !== index)
    }));
  };;

  // Enviar reserva
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.establishmentId) {
      toast.error("Debes seleccionar un establecimiento");
      return;
    }
    
    if (!formData.eventDate) {
      toast.error("Debes seleccionar una fecha");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const reservationData = {
        eventType: formData.eventType,
        establishmentId: formData.establishmentId,
        date: formData.eventDate,
        time: formData.eventTime,
        guests: formData.guests,
        comments: formData.comments,
        services: formData.selectedServices.map(s => ({
          serviceId: s.id,
          category: s.category,
          name: s.name || s.theme || s.menuType,
          cost: s.cost
        })),
        totalCost: totalCost,
        status: "pending"
      };
      
      const response = await api.post("/reservations", reservationData);
      
      toast.success("¡Reserva enviada exitosamente!");
      navigate("/profile", { state: { reservationId: response.data.id } });
      
    } catch (error) {
      console.error("Error enviando reserva:", error);
      toast.error("Error al enviar la reserva. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-purple-600 mb-6"
          >
            ← Volver
          </button>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Completa tu Reserva
          </h1>
          <p className="text-gray-600">
            Llena los detalles de tu evento y personaliza con servicios adicionales
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna 1: Información del Evento */}
          <div className="lg:col-span-2 space-y-8">
            {/* Información Básica */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Información del Evento</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Evento *
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar tipo</option>
                    {eventTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Invitados
                  </label>
                  <input
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha del Evento *
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora del Evento
                  </label>
                  <input
                    type="time"
                    name="eventTime"
                    value={formData.eventTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comentarios o Requerimientos Especiales
                </label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Déjanos saber si tienes algún requerimiento especial..."
                />
              </div>
            </div>

            {/* Selección de Establecimiento */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Selecciona el Establecimiento *</h2>
              
              {establishments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No hay establecimientos disponibles</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {establishments.map(establishment => (
                    <div
                      key={establishment.id}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        formData.establishmentId === establishment.id
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, establishmentId: establishment.id }))}
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={establishment.image}
                          alt={establishment.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="font-bold text-gray-800">{establishment.name}</h3>
                          <p className="text-gray-600 text-sm">{establishment.city}</p>
                          <p className="text-gray-600 text-sm">Capacidad: {establishment.capacity} personas</p>
                          {establishment.cost && (
                            <p className="text-lg font-bold text-purple-600 mt-2">
                              ${establishment.cost}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Agregar más servicios */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Agregar Más Servicios (Opcional)</h2>
              
              {/* Entretenimiento */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-700 mb-3">Entretenimiento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.entertainmentServices.slice(0, 4).map(service => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-gray-500">{service.type}</p>
                          <p className="text-sm font-bold">${service.hourlyRate}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => addService(service, "entretenimiento")}
                          className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-lg hover:bg-purple-200"
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Decoración */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-700 mb-3">Decoración</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.decorationServices.slice(0, 4).map(service => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{service.theme || "Paquete Decoración"}</p>
                          <p className="text-sm text-gray-500">${service.cost}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => addService(service, "decoracion")}
                          className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200"
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Catering */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-700 mb-3">Catering</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.cateringServices.slice(0, 4).map(service => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{service.menuType}</p>
                          <p className="text-sm text-gray-500">{service.numberDish} platos</p>
                          <p className="text-sm font-bold">${service.costDish}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => addService(service, "catering")}
                          className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200"
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Adicionales */}
              <div>
                <h3 className="font-bold text-gray-700 mb-3">Servicios Adicionales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.additionalServices.slice(0, 4).map(service => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-gray-500">${service.cost}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => addService(service, "adicionales")}
                          className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg hover:bg-yellow-200"
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Columna 2: Resumen y Checkout */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Resumen de Reserva</h2>
              
              {/* Servicios seleccionados */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-700 mb-3">Servicios Seleccionados</h3>
                {formData.selectedServices.length === 0 ? (
                  <p className="text-gray-500 text-sm">No hay servicios seleccionados</p>
                ) : (
                  <div className="space-y-3">
                    {formData.selectedServices.map((service, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium text-sm">
                            {service.name || service.theme || service.menuType || "Servicio"}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">{service.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">${service.cost || 0}</span>
                          <button
                            type="button"
                            onClick={() => removeService(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Establecimiento seleccionado */}
              {formData.establishmentId && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-700 mb-3">Establecimiento</h3>
                  {establishments.find(e => e.id === formData.establishmentId) && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium">
                        {establishments.find(e => e.id === formData.establishmentId).name}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${establishments.find(e => e.id === formData.establishmentId).cost || 0}
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Detalles del evento */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-700 mb-3">Detalles del Evento</h3>
                <div className="space-y-2 text-sm">
                  {formData.eventType && <p><strong>Tipo:</strong> {formData.eventType}</p>}
                  {formData.eventDate && <p><strong>Fecha:</strong> {formData.eventDate}</p>}
                  {formData.guests && <p><strong>Invitados:</strong> {formData.guests}</p>}
                </div>
              </div>
              
              {/* Total */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Estimado:</span>
                  <span className="text-2xl text-purple-600">${totalCost}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">* El pago final puede variar</p>
              </div>
              
              {/* Botón de enviar */}
              <button
                type="submit"
                disabled={isLoading || !formData.establishmentId || !formData.eventDate}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Enviando..." : "Confirmar Reserva"}
              </button>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                Al confirmar, aceptas nuestros términos y condiciones. Te contactaremos para confirmar disponibilidad.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}