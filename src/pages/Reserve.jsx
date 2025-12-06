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
  const [originalServices, setOriginalServices] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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

    // Basic client-side validation
    if (!form.eventId) {
      toast.error("El id del evento es obligatorio.");
      return;
    }
    if (!form.establishmentId) {
      toast.error("El id del establecimiento es obligatorio.");
      return;
    }

    // Validar que hay al menos una fecha válida
    const validDates = form.dates.filter(Boolean);
    if (validDates.length === 0) {
      toast.error("Debe seleccionar al menos una fecha.");
      return;
    }

    // Validar que todas las fechas son futuras
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (const dateStr of validDates) {
      const selectedDate = new Date(dateStr);
      if (selectedDate < today) {
        toast.error("No se pueden reservar fechas pasadas. Selecciona una fecha futura.");
        return;
      }
    }

    const payload = {
      guestNumber: Number(form.guestNumber),
      dates: validDates,
      eventId: String(form.eventId),
      establishmentId: String(form.establishmentId),
      comments: form.comments,
      // Ensure the services object matches backend DTO defaults to avoid NPEs
      services: {
        entertainment: [],
        decoration: null,
        catering: [],
        additionalServices: []
      },
    };

    try {
      setSubmitting(true);
      // If editing, try to preserve original services if user didn't modify them
      let finalPayload = { ...payload };
      if (reserveIdParam) {
        if (originalServices) {
          // Map existing summaries to request-shaped services
          const mapped = {
            entertainment: (originalServices.entertainment || []).map(e => ({ id: e.id, hours: e.hours })),
            decoration: originalServices.decoration ? { id: originalServices.decoration.id } : null,
            catering: (originalServices.catering || []).map(c => ({ id: c.id, menuType: c.menuType, numberDish: c.numberDish })),
            additionalServices: (originalServices.additionalServices || []).map(a => ({ id: a.id, quantity: a.quantity }))
          };
          finalPayload.services = mapped;
        }
        const res = await api.put(`/reserve/${reserveIdParam}`, finalPayload);
        const updated = res?.data;
        toast.success("Reserva actualizada correctamente.");
        // Redirect to confirmation (show updated data) if backend returned updated entity
        if (updated?.id) {
          navigate(`/reserve/confirmation/${updated.id}`);
        } else {
          navigate(`/reserve/${reserveIdParam}`);
        }
      } else {
        const res = await api.post("/reserve", payload);
        const created = res?.data;
        toast.success("Reserva creada correctamente.");
        // Prefer redirecting to a confirmation page showing the created reservation
        if (created?.id) {
          navigate(`/reserve/confirmation/${created.id}`);
        } else {
          // fallback to list
          navigate("/my-reservations");
        }
      }
    } catch (err) {
      console.error(err);
      const status = err?.response?.status;
      
      // Manejo de sesión expirada
      if (status === 401) {
        toast.error('Sesión expirada. Por favor inicia sesión de nuevo.');
        navigate('/sign-in');
        return;
      }
      
      const message = err?.response?.data?.message || "Error al crear la reserva.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // If editing existing reserve, fetch it and prefill
  useEffect(() => {
    const fetchReserve = async () => {
      if (reserveIdParam) {
        try {
          const res = await api.get(`/reserve/${reserveIdParam}`);
          const data = res.data;
          setForm({
            guestNumber: data.guestNumber || 1,
            dates: data.dates && data.dates.length ? data.dates.map(d => d) : [""],
            eventId: data.event?.id || eventIdParam || "",
            establishmentId: data.establishment?.id || "",
            comments: data.comments || "",
              services: data.services || { entertainment: [], decoration: null, catering: [], additionalServices: [] }
            });
            setOriginalServices(data.services || null);
        } catch (err) {
          console.error('Error cargando reserva para edición', err);
          const status = err?.response?.status;
          
          // Manejo de sesión expirada
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reserveIdParam]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Crear reserva</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium mb-1">Número de invitados</label>
          <input
            type="number"
            name="guestNumber"
            min={1}
            value={form.guestNumber}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fechas</label>
          {form.dates.map((d, i) => (
            <div key={i} className="flex gap-2 items-center mb-2">
              <input
                type="date"
                value={d}
                onChange={(e) => handleDateChange(i, e.target.value)}
                className="border px-3 py-2 rounded w-full"
              />
              {form.dates.length > 1 && (
                <button type="button" onClick={() => removeDateField(i)} className="text-red-600">Eliminar</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addDateField} className="text-sm text-blue-600">Agregar fecha</button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Event ID</label>
          <input
            name="eventId"
            value={form.eventId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="ID del evento"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Establishment ID</label>
          <input
            name="establishmentId"
            value={form.establishmentId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="ID del establecimiento"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Comentarios (opcional)</label>
          <textarea
            name="comments"
            value={form.comments}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            rows={4}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {submitting ? "Enviando..." : "Crear reserva"}
          </button>
        </div>
      </form>
    </div>
  );
}
