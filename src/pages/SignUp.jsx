import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { registerRequest } from "../api/auth";
import useSnackbar from "../hooks/useSnackbar"; 
export default function SignUp() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        city: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const { showSnackbar, SnackbarComponent } = useSnackbar(); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
       
        setIsLoading(true);
        
        try {
            console.log(" Datos a enviar:", { 
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                city: formData.city
            });
        
            await registerRequest({
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                city: formData.city,
                type: "CLIENTE"
            });
            
            showSnackbar(`¡Bienvenido ${formData.fullName}!  Cuenta creada exitosamente`, "success");
            
            // Limpiar formulario
            setFormData({
                fullName: "",
                email: "",
                password: "",
                phone: "",
                city: ""
            });
            
            setTimeout(() => {
                navigate("/sign-in");
            }, 3000);
            
        } catch (error) {
            console.error(" Error en registro:", error);
            
            let errorMessage = "Error al crear la cuenta";
            if (error.response) {
                errorMessage = error.response.data?.message || 
                              error.response.data?.error || 
                              errorMessage;
            } else if (error.request) {
                errorMessage = "No se pudo conectar con el servidor";
            }
            showSnackbar(errorMessage, "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSubmit(e);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center p-4">
            <SnackbarComponent position="top-right" /> 
            
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Card Container */}
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl text-white font-bold">E</span>
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Crear Cuenta
                        </h1>
                        <p className="text-gray-600 mt-2">Únete a nuestra comunidad</p>
                    </div>

                    {/* Registration Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre Completo
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Tu nombre completo"
                                    required
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onKeyPress={handleKeyPress}
                                    placeholder="tucorreo@ejemplo.com"
                                    required
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Phone Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Teléfono
                            </label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    onKeyPress={handleKeyPress}
                                    placeholder="3001234567"
                                    required
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* City Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ciudad
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Tu ciudad"
                                    required
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onKeyPress={handleKeyPress}
                                    placeholder="••••••••"
                                    required
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 pr-12 disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Mínimo 8 caracteres, una mayúscula, un número y un carácter especial (@$!%*?&)
                            </p>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start space-x-3">
                            <input
                                type="checkbox"
                                required
                                disabled={isLoading}
                                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 border-gray-300 mt-1 disabled:opacity-50"
                            />
                            <label className="text-sm text-gray-600">
                                Acepto los{" "}
                                <Link 
                                    to="/terms" 
                                    className="text-purple-600 hover:text-purple-500 font-medium"
                                    tabIndex={isLoading ? -1 : 0}
                                >
                                    Términos y Condiciones
                                </Link>{" "}
                                y la{" "}
                                <Link 
                                    to="/privacy" 
                                    className="text-purple-600 hover:text-purple-500 font-medium"
                                    tabIndex={isLoading ? -1 : 0}
                                >
                                    Política de Privacidad
                                </Link>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                                    Creando cuenta...
                                </div>
                            ) : (
                                "Crear Cuenta"
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="mt-8 text-center text-sm text-gray-600">
                        ¿Ya tienes una cuenta?{" "}
                        <Link 
                            to="/sign-in" 
                            className="text-purple-600 hover:text-purple-500 font-semibold transition-colors"
                            tabIndex={isLoading ? -1 : 0}
                        >
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}