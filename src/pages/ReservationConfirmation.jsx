import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

export default function ReservationConfirmation(){
  const { id } = useParams(); // ID de la reserva desde la URL
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reserve, setReserve] = useState(location.state?.reserve || null);
  const [loading, setLoading] = useState(!reserve);
  const [processingCancel, setProcessingCancel] = useState(false); // Estado para manejar la carga durante la cancelación

  useEffect(()=>{
    const fetch = async ()=>{
      if(!user){
        navigate('/sign-in');
        return;
      }
      if(reserve) return; // Si ya tenemos la reserva desde location.state, no la volvemos a buscar
      try{
        setLoading(true);
        const res = await api.get(`/reserve/${id}`);
        setReserve(res.data);
      }catch(err){
        console.error(err);
        // Opcional: manejar diferentes códigos de error (401, 404, etc.)
        const status = err?.response?.status;
        if (status === 401) {
          toast.error('Sesión expirada. Por favor inicia sesión de nuevo.');
          navigate('/sign-in');
          return;
        }
        toast.error('No se pudo cargar la reserva.');
      }finally{
        setLoading(false);
      }
    }
    fetch();
  },[id, user, reserve]); // Añadir 'reserve' a las dependencias por si acaso

  const handlePrint = ()=>{
    window.print();
  }

  // --- Nueva función para cancelar con confirmación ---
  const handleCancel = async () => {
    // 1. Solicitar confirmación al usuario
    const userConfirmed = window.confirm('¿Estás seguro que quieres cancelar esta reserva? Esta acción no se puede deshacer.');

    // 2. Si el usuario cancela la confirmación, salir de la función
    if (!userConfirmed) {
      console.log("Cancelación de reserva abortada por el usuario.");
      return;
    }

    // 3. Si el usuario confirma, proceder con la cancelación
    try {
      setProcessingCancel(true); // Activar indicador de carga
      console.log("Intentando cancelar la reserva con ID:", id);
      const response = await api.patch(`/reserve/${id}/cancelar`); // Llamada al endpoint de cancelación
      console.log("Reserva cancelada con éxito:", response.data);

      // Actualizar el estado local de la reserva para reflejar el cambio
      setReserve(response.data); // El backend debería devolver la reserva actualizada con estado CANCELADA

      toast.success('Reserva cancelada correctamente.'); // Mensaje de éxito

    } catch (err) {
      console.error("Error al cancelar la reserva:", err);
      console.error("Detalle del error:", err.response || err.message);
      let errorMessage = 'No se pudo cancelar la reserva.';
      if (err.response) {
        // Si el backend devuelve un mensaje de error específico
        errorMessage = err.response.data.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setProcessingCancel(false); // Desactivar indicador de carga
    }
  };
  // --- Fin de la nueva función ---

  if(loading) return <div className="p-6">Cargando...</div>
  if(!reserve) return <div className="p-6">Reserva no encontrada.</div>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Confirmación de Reserva</h1>

      <div className="bg-white p-6 rounded shadow">
        <p><strong>Número de reserva:</strong> {reserve.id}</p>
        <p><strong>Fecha(s):</strong> {reserve.dates?.map(d => new Date(d).toLocaleDateString()).join(', ')}</p>
        <p><strong>Total:</strong> ${reserve.totalCost}</p>
        <p><strong>Estado:</strong> {reserve.status}</p>

        <div className="mt-4">
          <h3 className="font-semibold">Resumen de servicios</h3>
          <pre className="whitespace-pre-wrap text-sm text-gray-700">{JSON.stringify(reserve.services || {}, null, 2)}</pre>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600">Puedes imprimir o guardar como PDF usando el botón "Imprimir" y seleccionando "Guardar como PDF" en el diálogo de impresión.</p>
        </div>

        {/* Botón para cancelar, solo visible si la reserva está en estado PROGRAMADA y no se está procesando la cancelación */}
        {reserve && reserve.status === 'PROGRAMADA' && !processingCancel && (
          <button
            onClick={handleCancel} // Vincular la nueva función handleCancel
            disabled={processingCancel} // Deshabilitar mientras se procesa
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded disabled:opacity-50 hover:bg-red-700 transition-colors"
          >
            {processingCancel ? "Cancelando..." : "Cancelar Reserva"} // Texto que cambia mientras se procesa
          </button>
        )}

        {/* Indicador visual opcional mientras se cancela */}
        {processingCancel && <p className="mt-2 text-gray-500">Procesando cancelación...</p>}

        <div className="flex gap-3 mt-6">
          <button onClick={handlePrint} className="bg-green-600 px-4 py-2 rounded text-white">Imprimir / Descargar</button>
          <button onClick={()=>navigate('/my-reservations')} className="bg-blue-600 px-4 py-2 rounded text-white">Ir a mis reservas</button>
          <button onClick={()=>navigate('/')} className="ml-auto underline">Ir al inicio</button>
        </div>
      </div>
    </div>
  )
}