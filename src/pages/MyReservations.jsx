import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

export default function MyReservations(){
  const [reserves, setReserves] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(()=>{
    const fetchReserves = async ()=>{
      if(!user){
        navigate('/sign-in');
        return;
      }
      try{
        setLoading(true);
        const res = await api.get('/reserve');
        setReserves(res.data || []);
      }catch(err){
        console.error(err);
        const status = err?.response?.status;
        if(status === 401){
          toast.error('Sesión expirada. Por favor inicia sesión de nuevo.');
          navigate('/sign-in');
          return;
        }
        toast.error('Error cargando tus reservas.');
      }finally{
        setLoading(false);
      }
    }
    fetchReserves();
  },[user]);

  if(loading) return <div className="p-6">Cargando...</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Mis reservas</h1>
      {reserves.length === 0 ? (
        <div>No tienes reservas aún.</div>
      ) : (
        <div className="space-y-4">
          {reserves.map(r => (
            <div key={r.id} className="p-4 border rounded flex justify-between items-center">
              <div>
                <div className="font-semibold">{r.event?.type || 'Evento'}</div>
                <div className="text-sm text-gray-600">{(r.dates && r.dates[0]) ? new Date(r.dates[0]).toLocaleDateString() : ''} • ${r.totalCost}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`px-3 py-1 rounded-full text-sm ${r.status === 'PROGRAMADA' ? 'bg-yellow-100 text-yellow-800' : r.status === 'COMPLETADA' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{r.status}</div>
                <Link to={`/reserve/${r.id}`} className="text-blue-600">Ver detalle</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
