import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

export default function ReservationDetails(){
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reserve, setReserve] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingCancel, setProcessingCancel] = useState(false);

  useEffect(()=>{
    const fetch = async ()=>{
      if(!user){
        navigate('/sign-in');
        return;
      }
      try{
        setLoading(true);
        const res = await api.get(`/reserve/${id}`);
        setReserve(res.data);
      }catch(err){
        console.error(err);
        const status = err?.response?.status;
        if(status === 401){
          toast.error('Sesión expirada. Por favor inicia sesión de nuevo.');
          navigate('/sign-in');
          return;
        }
        toast.error('Error cargando la reserva');
      }finally{
        setLoading(false);
      }
    }
    fetch();
  },[id, user]);

  const handleCancel = async ()=>{
    if(!confirm('¿Estás seguro que quieres cancelar esta reserva?')) return;
    try{
      setProcessingCancel(true);
      await api.patch(`/reserve/${id}/cancelar`);
      toast.success('Reserva cancelada');
      // refresh
      const res = await api.get(`/reserve/${id}`);
      setReserve(res.data);
    }catch(err){
      console.error(err);
      toast.error('No se pudo cancelar la reserva');
    }finally{
      setProcessingCancel(false);
    }
  }

  if(loading) return <div className="p-6">Cargando...</div>
  if(!reserve) return <div className="p-6">Reserva no encontrada</div>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Reserva #{reserve.id}</h1>
      <div className="bg-white p-4 rounded shadow">
        <p><strong>Evento:</strong> {reserve.event?.type}</p>
        <p><strong>Establecimiento:</strong> {reserve.establishment?.name}</p>
        <p><strong>Fechas:</strong> {reserve.dates?.map(d => new Date(d).toLocaleDateString()).join(', ')}</p>
        <p><strong>Invitados:</strong> {reserve.guestNumber}</p>
        <p><strong>Total:</strong> ${reserve.totalCost}</p>
        <p><strong>Estado:</strong> {reserve.status}</p>
        <p className="mt-2"><strong>Comentarios:</strong> {reserve.comments || '-'}</p>

        <div className="mt-4">
          <h3 className="font-semibold">Servicios incluidos</h3>
          <pre className="whitespace-pre-wrap text-sm text-gray-700">{JSON.stringify(reserve.services, null, 2)}</pre>
        </div>

        <div className="flex gap-3 mt-6">
          {reserve.status === 'PROGRAMADA' && (
            <>
              <button onClick={()=>navigate(`/reserve?id=${reserve.id}`)} className="bg-yellow-500 px-4 py-2 rounded text-white">Editar</button>
              <button onClick={handleCancel} disabled={processingCancel} className="bg-red-600 px-4 py-2 rounded text-white">{processingCancel ? 'Cancelando...' : 'Cancelar'}</button>
            </>
          )}
          <button onClick={()=>navigate('/my-reservations')} className="ml-auto underline">Volver a mis reservas</button>
        </div>
      </div>
    </div>
  )
}
