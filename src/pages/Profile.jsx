// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [payments, setPayments] = useState([]);
    const [activeTab, setActiveTab] = useState("overview");
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                await fetchUserData(currentUser.uid);
                await fetchUserReservations(currentUser.uid);
                await fetchUserPayments(currentUser.uid);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const fetchUserData = async (userId) => {
        try {
            const userDoc = await getDoc(doc(db, "users", userId));
            if (userDoc.exists()) {
                setUserData(userDoc.data());
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const fetchUserReservations = async (userId) => {
        try {
            const q = query(collection(db, "reserves"), where("client.id", "==", userId));
            const querySnapshot = await getDocs(q);
            const reservationsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setReservations(reservationsData);
        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    };

    const fetchUserPayments = async (userId) => {
        try {
            const userDoc = await getDoc(doc(db, "users", userId));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setPayments(userData.payments || []);
            }
        } catch (error) {
            console.error("Error fetching payments:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("¡Sesión cerrada exitosamente!");
            navigate("/");
        } catch (error) {
            toast.error("Error al cerrar sesión");
        }
    };

    const calculateTotalSpent = () => {
        return payments.reduce((total, payment) => total + (payment.totalCost || 0), 0);
    };

    const getUpcomingEvents = () => {
        const today = new Date();
        return reservations.filter(reservation => 
            new Date(reservation.dates?.[0]) >= today
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600 font-medium">Cargando perfil...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Usuario no encontrado</h2>
                    <p className="text-gray-600 mb-4">Inicia sesión para ver tu perfil</p>
                    <button 
                        onClick={() => navigate("/sign-in")}
                        className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors"
                    >
                        Iniciar Sesión
                    </button>
                </div>
            </div>
        );
    }

    const upcomingEvents = getUpcomingEvents();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 py-8 px-4 font-poppins">
            <div className="relative max-w-6xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="relative">
                                <img
                                    src={"https://i.pinimg.com/474x/90/9b/85/909b8550f50619a61b66f820d0bbb8f0.jpg"}
                                    alt="User"
                                    className="w-24 h-24 rounded-full border-4 border-white/80 object-cover shadow-lg"
                                />
                            </div>
                            
                            <div className="text-center md:text-left flex-1">
                                <h1 className="text-3xl font-bold mb-2">
                                    {user.displayName || userData?.name || "Usuario"}
                                </h1>
                                <p className="text-white/80">{user.email}</p>
                                <p className="text-white/60">{userData?.phone || "Teléfono no registrado"}</p>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="bg-white/20 rounded-xl p-4">
                                    <p className="text-2xl font-bold">{reservations.length}</p>
                                    <p className="text-sm">Reservas</p>
                                </div>
                                <div className="bg-white/20 rounded-xl p-4">
                                    <p className="text-2xl font-bold">{upcomingEvents.length}</p>
                                    <p className="text-sm">Próximos</p>
                                </div>
                                <div className="bg-white/20 rounded-xl p-4">
                                    <p className="text-2xl font-bold">${calculateTotalSpent()}</p>
                                    <p className="text-sm">Total Gastado</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-8">
                            {["overview", "reservations", "payments", "settings"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                                        activeTab === tab
                                            ? "border-purple-500 text-purple-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                                >
                                    {tab === "overview" ? "Resumen" : 
                                     tab === "reservations" ? "Reservas" :
                                     tab === "payments" ? "Pagos" : "Configuración"}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
                    {activeTab === "overview" && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-800">Resumen de Actividad</h2>
                            
                            {/* Upcoming Events */}
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Próximos Eventos</h3>
                                {upcomingEvents.length > 0 ? (
                                    <div className="space-y-4">
                                        {upcomingEvents.slice(0, 3).map((reservation) => (
                                            <div key={reservation.id} className="bg-white rounded-xl p-4 shadow-sm">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800">{reservation.event?.type}</h4>
                                                        <p className="text-sm text-gray-600">
                                                            {reservation.dates?.[0] && new Date(reservation.dates[0]).toLocaleDateString('es-ES')}
                                                        </p>
                                                    </div>
                                                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                        ${reservation.totalCost || 0}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No tienes eventos próximos</p>
                                )}
                            </div>

                            {/* Recent Payments */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Pagos Recientes</h3>
                                {payments.length > 0 ? (
                                    <div className="space-y-4">
                                        {payments.slice(0, 3).map((payment, index) => (
                                            <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800">Pago #{payment.id?.slice(0, 8)}</h4>
                                                        <p className="text-sm text-gray-600">
                                                            {payment.coveredServices?.length || 0} servicios
                                                        </p>
                                                    </div>
                                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                                        ${payment.totalCost || 0}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No hay historial de pagos</p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "reservations" && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Mis Reservas</h2>
                            {reservations.length > 0 ? (
                                <div className="space-y-4">
                                    {reservations.map((reservation) => (
                                        <div key={reservation.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-800">{reservation.event?.type}</h3>
                                                    <p className="text-gray-600">Establecimiento: {reservation.establishment?.name}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                    reservation.status === "confirmed" 
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                }`}>
                                                    {reservation.status || "Pendiente"}
                                                </span>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">Fechas</p>
                                                    <p className="font-medium">
                                                        {reservation.dates?.[0] && new Date(reservation.dates[0]).toLocaleDateString('es-ES')}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Invitados</p>
                                                    <p className="font-medium">{reservation.guestNumber || 0}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Costo Total</p>
                                                    <p className="font-medium text-green-600">${reservation.totalCost || 0}</p>
                                                </div>
                                            </div>

                                            {/* Services Summary */}
                                            <div className="border-t pt-4">
                                                <h4 className="font-semibold text-gray-800 mb-2">Servicios Contratados:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {reservation.services?.entertainment?.map((service, idx) => (
                                                        <span key={idx} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                                                            Entretenimiento
                                                        </span>
                                                    ))}
                                                    {reservation.services?.decoration && (
                                                        <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs">
                                                            Decoración
                                                        </span>
                                                    )}
                                                    {reservation.services?.catering?.map((service, idx) => (
                                                        <span key={idx} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                                                            Catering
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 text-lg">No tienes reservas aún</p>
                                    <button 
                                        onClick={() => navigate("/services")}
                                        className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors"
                                    >
                                        Explorar Servicios
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "payments" && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Historial de Pagos</h2>
                            {payments.length > 0 ? (
                                <div className="space-y-4">
                                    {payments.map((payment, index) => (
                                        <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                            <div className="flex justify-between items-center mb-4">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-800">Pago #{payment.id?.slice(0, 8) || `P${index + 1}`}</h3>
                                                    <p className="text-gray-600">
                                                        {payment.coveredServices?.join(", ") || "Servicios varios"}
                                                    </p>
                                                </div>
                                                <span className="text-2xl font-bold text-green-600">
                                                    ${payment.totalCost || 0}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm text-gray-500">
                                                <span>Fecha del pago</span>
                                                <span>Completado</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No hay historial de pagos</p>
                            )}
                        </div>
                    )}

                    {activeTab === "settings" && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Configuración</h2>
                            <div className="space-y-6">
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Información Personal</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                                            <input 
                                                type="text" 
                                                defaultValue={user.displayName || userData?.name}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                                            <input 
                                                type="tel" 
                                                defaultValue={userData?.phone}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                            <input 
                                                type="email" 
                                                defaultValue={user.email}
                                                disabled
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Usuario</label>
                                            <input 
                                                type="text" 
                                                defaultValue={userData?.type || "Cliente"}
                                                disabled
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                            />
                                        </div>
                                    </div >
                                    <button className=" mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                                        Guardar Cambios
                                    </button>
                                </div>

                                <div className="text-center">
                                    <button 
                                        onClick={handleLogout}
                                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}