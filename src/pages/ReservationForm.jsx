import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import useSnackbar from "../hooks/useSnackbar"


function ServiceModal({ isOpen, onClose, onConfirm, serviceType, serviceName, defaultValue }) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue, isOpen]);

  if (!isOpen) return null;

  const getModalConfig = () => {
    switch(serviceType) {
      case "entretenimiento":
        return {
          title: "¿Cuántas horas?",
          label: "Número de horas",
          placeholder: "Ej: 3",
          icon: "🎵",
          color: "purple"
        };
      case "adicionales":
        return {
          title: "¿Qué cantidad?",
          label: "Cantidad",
          placeholder: "Ej: 1",
          icon: "📦",
          color: "yellow"
        };
      case "catering":
        return {
          title: "¿Número de platos?",
          label: "Cantidad de platos",
          placeholder: "Ej: 10",
          icon: "🍽️",
          color: "green"
        };
      default:
        return {
          title: "Cantidad",
          label: "Cantidad",
          placeholder: "1",
          icon: "✨",
          color: "blue"
        };
    }
  };

  const config = getModalConfig();
  const colorClasses = {
    purple: "bg-purple-500 hover:bg-purple-600 focus:ring-purple-500",
    yellow: "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500",
    green: "bg-green-500 hover:bg-green-600 focus:ring-green-500",
    blue: "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">{config.icon}</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {config.title}
          </h3>
          <p className="text-gray-600 text-sm">
            Para: <span className="font-semibold">{serviceName}</span>
          </p>
        </div>

        {/* Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {config.label}
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={config.placeholder}
            min="1"
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            autoFocus
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(parseInt(value) || 1)}
            className={`flex-1 px-4 py-3 text-white rounded-xl font-medium transition-all ${colorClasses[config.color]}`}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReservationForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { serviceId } = useParams();
 
  const { showSnackbar, SnackbarComponent } = useSnackbar();

  const [modalState, setModalState] = useState({
    isOpen: false,
    serviceType: null,
    service: null,
    category: null
  });

  const [formData, setFormData] = useState({
    eventType: "",
    eventDate: "",
    eventTime: "",
    guests: "",
    comments: "",
    establishmentId: "",
    selectedServices: serviceId && location.state?.category 
      ? [{ 
          id: serviceId, 
          category: location.state?.category,
          name: location.state?.serviceName || "Servicio", 
          cost: location.state?.serviceCost || 0
        }] 
      : [],
    entertainmentServices: [],
    decorationServices: [],
    cateringServices: [],
    additionalServices: [],
  });
  
  const [establishments, setEstablishments] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCost, setTotalCost] = useState(0);

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

  useEffect(() => {
    const loadFormData = async () => {
      try {
        setIsLoading(true);
        
        const [establishmentsRes, eventTypesRes] = await Promise.all([
          api.get("/establishments"),
          api.get("/events")
        ]);

        setEstablishments(establishmentsRes.data || []);
        setEventTypes(eventTypesRes.data || []);
        
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
          additionalServices: additionalRes.data || [],
        }));
        
      } catch (error) {
        console.error("Error cargando datos:", error);
        toast.error("Error al cargar datos del formulario");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFormData();
  }, [serviceId]);

  const calculateTotal = useCallback(() => {
    let total = 0;
    
    formData.selectedServices.forEach(service => {
      if (service.totalCost) {
        total += service.totalCost;
      } else {
        const cost = service.cost || getServiceCost(service, service.category) || 0;
        total += Number(cost) || 0;
      }
    });
    
    if (formData.establishmentId && establishments.length > 0) {
      const selectedEstablishment = establishments.find(e => e.id === formData.establishmentId);
      if (selectedEstablishment?.cost) {
        total += Number(selectedEstablishment.cost) || 0;
      }
    }
    
    setTotalCost(total);
  }, [formData.selectedServices, formData.establishmentId, establishments]);

  useEffect(() => {
    calculateTotal();
  }, [calculateTotal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const openServiceModal = (service, category) => {
    setModalState({
      isOpen: true,
      serviceType: category,
      service: service,
      category: category
    });
  };

 
  const handleModalConfirm = (quantity) => {
    const { service, category } = modalState;
    
    let serviceDetails = {
      ...service,
      category,
      name: service.name || service.theme || service.menuType
    };
    
    if (category === "entretenimiento") {
      serviceDetails.hours = quantity;
      serviceDetails.totalCost = quantity * (service.hourlyRate || 0);
    }
    
    if (category === "adicionales") {
      serviceDetails.quantity = quantity;
      serviceDetails.totalCost = quantity * (service.cost || 0);
    }
    
    if (category === "catering") {
      serviceDetails.numberDish = quantity;
      serviceDetails.menuType = service.menuType || "GENERAL";
      serviceDetails.totalCost = quantity * (service.costDish || 0);
    }
    
    if (category === "decoracion") {
      serviceDetails.totalCost = service.cost || 0;
    }
    
    setFormData(prev => ({
      ...prev,
      selectedServices: [...prev.selectedServices, serviceDetails]
    }));
    
    // Cerrar modal
    setModalState({ isOpen: false, serviceType: null, service: null, category: null });
  };

  
  const addService = (service, category) => {
    if (category === "decoracion") {
      let serviceDetails = {
        ...service,
        category,
        name: service.theme || "Paquete Decoración",
        totalCost: service.cost || 0
      };
      
      setFormData(prev => ({
        ...prev,
        selectedServices: [...prev.selectedServices, serviceDetails]
      }));
      return;
    }
    
    openServiceModal(service, category);
  };

  const removeService = (index) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.establishmentId) {
       showSnackbar("Debes seleccionar un establecimiento");
      return;
    }
    
     if (!formData.eventDate) {
      showSnackbar("Debes seleccionar una fecha para el evento", "error");
      return;
    }
    
    if (!formData.eventType) {
      showSnackbar("Selecciona el tipo de evento (Boda, Cumpleaños, etc.)", "error");
      return;
    }

    const today = new Date();
    const selectedDate = new Date(formData.eventDate);
    if (selectedDate < today) {
      showSnackbar("La fecha del evento no puede ser en el pasado", "error");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const servicesPayload = {
        entertainment: [],
        decoration: {},
        catering: [],
        additionalServices: []
      };
      
      formData.selectedServices.forEach(service => {
        switch(service.category) {
          case "entretenimiento":
            servicesPayload.entertainment.push({
              id: service.id,
              hours: service.hours || 2
            });
            break;
            
          case "decoracion":
            servicesPayload.decoration = {
              id: service.id
            };
            break;
            
          case "catering":
            servicesPayload.catering.push({
              id: service.id,
              menuType: service.menuType || "GENERAL",
              numberDish: service.numberDish || formData.guests || 10
            });
            break;
            
          case "adicionales":
            servicesPayload.additionalServices.push({
              id: service.id,
              quantity: service.quantity || 1
            });
            break;
        }
      });
      
      const reservationPayload = {
        guestNumber: parseInt(formData.guests) || 0,
        dates: [formData.eventDate],
        eventId: formData.eventType,
        establishmentId: formData.establishmentId,
        comments: formData.comments,
        services: servicesPayload
      };
      
      console.log("Payload a enviar:", JSON.stringify(reservationPayload, null, 2));
      
      const response = await api.post("/reserve", reservationPayload);
      
      showSnackbar(
        `¡Reserva creada exitosamente! ID: ${response.data.id?.slice(0, 8)}...`, 
        "success"
      );
      navigate("/profile", { state: { reservationId: response.data.id } });
      
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || 
        error.response?.data?.error || 
        "Error al crear reserva", 
        "error"
      );
      console.error("Error creating reserva:", error);
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

 
  const getDefaultModalValue = () => {
    if (modalState.serviceType === "catering") {
      return formData.guests || "10";
    }
    if (modalState.serviceType === "entretenimiento") {
      return "3";
    }
    return "1";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <SnackbarComponent position="bottom" />
      <ServiceModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, serviceType: null, service: null, category: null })}
        onConfirm={handleModalConfirm}
        serviceType={modalState.serviceType}
        serviceName={modalState.service?.name || modalState.service?.theme || modalState.service?.menuType || "Servicio"}
        defaultValue={getDefaultModalValue()}
      />

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
          <div className="lg:col-span-2 space-y-8">
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
                    {eventTypes.map(event => (
                      <option key={event.id} value={event.id}>{event.type}</option>
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
                          src={establishment.imageUrl}
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

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Agregar Más Servicios (Opcional)</h2>
              
              <div className="mb-6">
                <h3 className="font-bold text-gray-700 mb-3">Entretenimiento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.entertainmentServices.slice(0, 4).map(service => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-gray-500">{service.type}</p>
                          <p className="text-sm font-bold">${service.hourlyRate} por hora</p>
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
              
              <div className="mb-6">
                <h3 className="font-bold text-gray-700 mb-3">Catering</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.cateringServices.slice(0, 4).map(service => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{service.menuType}</p>
                          <p className="text-sm text-gray-500">${service.costDish} por plato</p>
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
              
              <div>
                <h3 className="font-bold text-gray-700 mb-3">Servicios Adicionales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.additionalServices.slice(0, 4).map(service => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-gray-500">${service.cost} c/u</p>
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

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Resumen de Reserva</h2>
              
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
                          
                          {service.hours && (
                            <p className="text-xs text-gray-500">Horas: {service.hours}</p>
                          )}
                          {service.quantity && (
                            <p className="text-xs text-gray-500">Cantidad: {service.quantity}</p>
                          )}
                          {service.numberDish && (
                            <p className="text-xs text-gray-500">Platos: {service.numberDish}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">${service.totalCost || service.cost || 0}</span>
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
              
              <div className="mb-6">
                <h3 className="font-bold text-gray-700 mb-3">Detalles del Evento</h3>
                <div className="space-y-2 text-sm">
                  {formData.eventType && (
                    <p>
                      <strong>Tipo:</strong> {
                        eventTypes.find(event => event.id === formData.eventType)?.type ||
                        formData.eventType
                      }
                    </p>
                  )}
                  {formData.eventDate && <p><strong>Fecha:</strong> {formData.eventDate}</p>}
                  {formData.guests && <p><strong>Invitados:</strong> {formData.guests}</p>}
                </div>
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Estimado:</span>
                  <span className="text-2xl text-purple-600">${totalCost}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">* El pago final puede variar</p>
              </div>
              
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