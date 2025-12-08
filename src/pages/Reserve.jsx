import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

export default function Reserve() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventIdParam = searchParams.get("eventId");
  const reserveIdParam = searchParams.get("id");

  // Form state
  const [form, setForm] = useState({
    guestNumber: 1,
    dates: [""],
    eventId: eventIdParam || "",
    establishmentId: "",
    comments: "",
    services: {
      entertainment: [],
      decoration: null,
      catering: [],
      additionalServices: []
    }
  });

  // Data loading states
  const [establishments, setEstablishments] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState({
    establishments: false,
    events: false,
    submitting: false
  });

  // Validation errors
  const [errors, setErrors] = useState({});
  const [originalServices, setOriginalServices] = useState(null);

  // Compute cost breakdown
  const computeCostBreakdown = () => {
    const validDates = form.dates.filter(Boolean);
    const selectedEstablishment = establishments.find(e => e.id === form.establishmentId);
    
    let breakdown = {
      establishmentCost: 0,
      servicesCost: 0,
      totalCost: 0
    };

    if (selectedEstablishment && validDates.length > 0) {
      breakdown.establishmentCost = selectedEstablishment.cost * validDates.length;
      // TODO: Calcular costo de servicios cuando se implementen
      breakdown.totalCost = breakdown.establishmentCost + breakdown.servicesCost;
    }

    return breakdown;
  };

  const costBreakdown = computeCostBreakdown();

  // Validate form in real-time
  useEffect(() => {
    const newErrors = {};

    if (!form.eventId) newErrors.eventId = "Evento requerido";
    if (!form.establishmentId) newErrors.establishmentId = "Establecimiento requerido";
    if (form.guestNumber < 1) newErrors.guestNumber = "Mínimo 1 invitado";

    const validDates = form.dates.filter(Boolean);
    if (validDates.length === 0) newErrors.dates = "Selecciona al menos una fecha";

    const selectedEst = establishments.find(e => e.id === form.establishmentId);
    if (selectedEst && form.guestNumber > (selectedEst.maxCapacity || Infinity)) {
      newErrors.guestNumber = `Máximo ${selectedEst.maxCapacity} invitados para este establecimiento`;
    }

    // Validar fechas futuras
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (const dateStr of validDates) {
      const selectedDate = new Date(dateStr);
      if (selectedDate < today) {
        newErrors.dates = "No se pueden reservar fechas pasadas";
        break;
      }
    }

    setErrors(newErrors);
  }, [form, establishments]);

  // Load establishments
  useEffect(() => {
    const fetchEstablishments = async () => {
      try {
        setLoading(prev => ({ ...prev, establishments: true }));
        const res = await api.get('/establishments');
        setEstablishments(res.data || []);
      } catch (err) {
        console.error('Error cargando establecimientos', err);
        toast.error('No se pudieron cargar los establecimientos');
      } finally {
        setLoading(prev => ({ ...prev, establishments: false }));
      }
    };
    fetchEstablishments();
  }, []);

  // Load events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(prev => ({ ...prev, events: true }));
        // Asumiendo que existe GET /events o similar
        const res = await api.get('/events');
        setEvents(res.data || []);
      } catch (err) {
        console.error('Error cargando eventos', err);
        // No mostrar error si no existe el endpoint, dejar input como alternativa
        setEvents([]);
      } finally {
        setLoading(prev => ({ ...prev, events: false }));
      }
    };
    fetchEvents();
  }, []);

  // Load reserve data if editing
  useEffect(() => {
    const fetchReserve = async () => {
      if (reserveIdParam) {
        try {
          const res = await api.get(`/reserve/${reserveIdParam}`);
          const data = res.data;
          setForm({
            guestNumber: data.guestNumber || 1,
            dates: data.dates && data.dates.length ? data.dates : [""],
            eventId: data.event?.id || eventIdParam || "",
            establishmentId: data.establishment?.id || "",
            comments: data.comments || "",
            services: data.services || { entertainment: [], decoration: null, catering: [], additionalServices: [] }
          });
          setOriginalServices(data.services || null);
        } catch (err) {
          console.error('Error cargando reserva para edición', err);
          const status = err?.response?.status;
          
          if (status === 401) {
            toast.error('Sesión expirada. Por favor inicia sesión de nuevo.');
            navigate('/sign-in');
            return;
          }
          
          toast.error('No se pudo cargar la reserva para editar');
        }
      }
    };
    fetchReserve();
  }, [reserveIdParam, eventIdParam, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (index, value) => {
    const newDates = [...form.dates];
    newDates[index] = value;
    setForm((prev) => ({ ...prev, dates: newDates }));
  };

  const addDateField = () => {
    setForm((prev) => ({ ...prev, dates: [...prev.dates, ""] }));
  };

  const removeDateField = (index) => {
    const newDates = form.dates.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, dates: newDates }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Por favor inicia sesión para crear una reserva.");
      navigate("/sign-in");
      return;
    }

    // Validar que no hay errores
    if (Object.keys(errors).length > 0) {
      toast.error("Por favor corrige los errores del formulario");
      return;
    }

    // Mostrar confirmación
    const selectedEvent = events.find(ev => ev.id === form.eventId);
    const selectedEst = establishments.find(e => e.id === form.establishmentId);
    const validDates = form.dates.filter(Boolean);

    const confirmMessage = `
Resumen de tu reserva:
- Evento: ${selectedEvent?.type || 'Desconocido'}
- Establecimiento: ${selectedEst?.name || 'Desconocido'}
- Fechas: ${validDates.join(', ')}
- Invitados: ${form.guestNumber}
- Total: $${costBreakdown.totalCost}

¿Deseas continuar?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    const payload = {
      guestNumber: Number(form.guestNumber),
      dates: validDates,
      eventId: String(form.eventId),
      establishmentId: String(form.establishmentId),
      comments: form.comments,
      services: {
        entertainment: [],
        decoration: null,
        catering: [],
        additionalServices: []
      },
    };

    try {
      setLoading(prev => ({ ...prev, submitting: true }));
      
      let finalPayload = { ...payload };
      if (reserveIdParam && originalServices) {
        const mapped = {
          entertainment: (originalServices.entertainment || []).map(e => ({ id: e.id, hours: e.hours })),
          decoration: originalServices.decoration ? { id: originalServices.decoration.id } : null,
          catering: (originalServices.catering || []).map(c => ({ id: c.id, menuType: c.menuType, numberDish: c.numberDish })),
          additionalServices: (originalServices.additionalServices || []).map(a => ({ id: a.id, quantity: a.quantity }))
        };
        finalPayload.services = mapped;
      }

      let response;
      if (reserveIdParam) {
        response = await api.put(`/reserve/${reserveIdParam}`, finalPayload);
        toast.success("Reserva actualizada correctamente.");
      } else {
        response = await api.post("/reserve", finalPayload);
        toast.success("Reserva creada correctamente.");
      }

      const created = response?.data;
      if (created?.id) {
        navigate(`/reserve/confirmation/${created.id}`);
      } else {
        navigate("/my-reservations");
      }
    } catch (err) {
      console.error(err);
      const status = err?.response?.status;
      
      if (status === 401) {
        toast.error('Sesión expirada. Por favor inicia sesión de nuevo.');
        navigate('/sign-in');
        return;
      }
      
      const message = err?.response?.data?.message || "Error al crear la reserva.";
      toast.error(message);
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">
        {reserveIdParam ? "Editar Reserva" : "Crear Nueva Reserva"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow">
        {/* Sección 1: Información Básica */}
        <fieldset className="border-b pb-6">
          <legend className="text-lg font-semibold mb-4 text-gray-800">Información Básica</legend>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Número de Invitados <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="guestNumber"
              min={1}
              max={500}
              value={form.guestNumber}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 ${
                errors.guestNumber ? 'border-red-500 ring-red-200' : 'border-gray-300 ring-blue-200'
              }`}
            />
            {errors.guestNumber && <p className="text-red-500 text-sm mt-1">{errors.guestNumber}</p>}
          </div>
        </fieldset>

        {/* Sección 2: Evento y Establecimiento */}
        <fieldset className="border-b pb-6">
          <legend className="text-lg font-semibold mb-4 text-gray-800">Lugar y Detalles</legend>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Evento */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Evento <span className="text-red-500">*</span>
              </label>
              {events.length > 0 ? (
                <select
                  name="eventId"
                  value={form.eventId}
                  onChange={handleChange}
                  className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 ${
                    errors.eventId ? 'border-red-500 ring-red-200' : 'border-gray-300 ring-blue-200'
                  }`}
                >
                  <option value="">Selecciona un evento</option>
                  {events.map(evt => (
                    <option key={evt.id} value={evt.id}>
                      {evt.type}
                    </option>
                  ))}
                </select>
              ) : loading.events ? (
                <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded bg-gray-100">
                  <span className="animate-spin">⏳</span>
                  <span className="text-gray-600 text-sm">Cargando eventos...</span>
                </div>
              ) : (
                <input
                  name="eventId"
                  value={form.eventId}
                  onChange={handleChange}
                  placeholder="ID del evento"
                  className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 ${
                    errors.eventId ? 'border-red-500 ring-red-200' : 'border-gray-300 ring-blue-200'
                  }`}
                />
              )}
              {errors.eventId && <p className="text-red-500 text-sm mt-1">{errors.eventId}</p>}
            </div>

            {/* Establecimiento */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Establecimiento <span className="text-red-500">*</span>
              </label>
              {loading.establishments ? (
                <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded bg-gray-100">
                  <span className="animate-spin">⏳</span>
                  <span className="text-gray-600 text-sm">Cargando establecimientos...</span>
                </div>
              ) : (
                <select
                  name="establishmentId"
                  value={form.establishmentId}
                  onChange={handleChange}
                  className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 ${
                    errors.establishmentId ? 'border-red-500 ring-red-200' : 'border-gray-300 ring-blue-200'
                  }`}
                >
                  <option value="">Selecciona un establecimiento</option>
                  {establishments.map(est => (
                    <option key={est.id} value={est.id}>
                      {est.name} - ${est.cost}/día (Cap: {est.maxCapacity} personas)
                    </option>
                  ))}
                </select>
              )}
              {errors.establishmentId && <p className="text-red-500 text-sm mt-1">{errors.establishmentId}</p>}
            </div>
          </div>
        </fieldset>

        {/* Sección 3: Fechas */}
        <fieldset className="border-b pb-6">
          <legend className="text-lg font-semibold mb-4 text-gray-800">Fechas de Reserva</legend>
          
          <div className="space-y-3">
            {form.dates.map((d, i) => (
              <div key={i} className="flex gap-2 items-end">
                <div className="flex-1">
                  <input
                    type="date"
                    value={d}
                    onChange={(e) => handleDateChange(i, e.target.value)}
                    className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 ${
                      errors.dates ? 'border-red-500 ring-red-200' : 'border-gray-300 ring-blue-200'
                    }`}
                  />
                </div>
                {form.dates.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDateField(i)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            ))}
            {errors.dates && <p className="text-red-500 text-sm mt-1">{errors.dates}</p>}
          </div>

          <button
            type="button"
            onClick={addDateField}
            className="mt-3 px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition text-sm font-medium"
          >
            + Agregar otra fecha
          </button>
        </fieldset>

        {/* Sección 4: Comentarios */}
        <fieldset className="border-b pb-6">
          <legend className="text-lg font-semibold mb-4 text-gray-800">Detalles Adicionales</legend>
          
          <div>
            <label className="block text-sm font-medium mb-2">Comentarios (opcional)</label>
            <textarea
              name="comments"
              value={form.comments}
              onChange={handleChange}
              placeholder="Agrega cualquier detalle importante sobre tu reserva..."
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              rows={4}
            />
            <p className="text-gray-500 text-xs mt-1">Máximo 900 caracteres</p>
          </div>
        </fieldset>

        {/* Resumen de Costo */}
        {form.establishmentId && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Resumen de Costo</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Establecimiento:</span>
                <span className="font-medium">${costBreakdown.establishmentCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Servicios adicionales:</span>
                <span className="font-medium">${costBreakdown.servicesCost.toFixed(2)}</span>
              </div>
              <div className="border-t border-blue-200 pt-2 flex justify-between">
                <span className="font-semibold text-gray-800">Total:</span>
                <span className="font-bold text-lg text-blue-600">${costBreakdown.totalCost.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Botones de Acción */}
        <div className="flex gap-4 justify-end pt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading.submitting || Object.keys(errors).length > 0}
            className={`px-6 py-2 rounded font-medium text-white flex items-center gap-2 transition ${
              loading.submitting || Object.keys(errors).length > 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading.submitting && <span className="animate-spin">⏳</span>}
            {loading.submitting ? 'Procesando...' : reserveIdParam ? 'Actualizar Reserva' : 'Crear Reserva'}
          </button>
        </div>
      </form>
    </div>
  );
}
