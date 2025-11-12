import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { registerRequest } from "../api/auth"; // ← Importar tu servicio
import { toast } from "react-hot-toast";

export default function SignUp() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: "", // ← Agregar teléfono
        city: ""   // ← Agregar ciudad
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // Handle input field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submission (Spring Boot sign-up)
const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🎯 handleSubmit EJECUTÁNDOSE - Formulario enviado"); // ← AGREGA ESTA LÍNEA
    setIsLoading(true);
    
    try {
        console.log("📝 Datos a enviar:", {  // ← Y ESTA TAMBIÉN
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            city: formData.city
        });
       
        await registerRequest.register({
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            city: formData.city,
            type: "CLIENTE"
        });
        
        toast.success("¡Cuenta creada exitosamente! 🎉");
        navigate("/sign-in");
    } catch (error) {
        console.error("Error en registro:", error);
        toast.error(error.response?.data?.message || "Error al crear la cuenta");
    } finally {
        setIsLoading(false);
    }
};

    // Google sign-in - REMOVER o implementar con Spring Boot después
    const handleGoogleSignIn = async () => {
        toast.error("Registro con Google no disponible temporalmente");
        // Si quieres mantenerlo, necesitarás implementar OAuth2 en Spring Boot
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center p-4">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden">
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
                                    placeholder="Tu nombre completo"
                                    required
                                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
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
                                    placeholder="tucorreo@ejemplo.com"
                                    required
                                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
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
                                    placeholder="3001234567"
                                    required
                                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
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
                                    placeholder="Tu ciudad"
                                    required
                                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
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
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Mínimo 8 caracteres, una mayúscula, un número y un carácter especial
                            </p>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start space-x-3">
                            <input
                                type="checkbox"
                                required
                                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 border-gray-300 mt-1"
                            />
                            <label className="text-sm text-gray-600">
                                Acepto los{" "}
                                <Link to="/terms" className="text-purple-600 hover:text-purple-500 font-medium">
                                    Términos y Condiciones
                                </Link>{" "}
                                y la{" "}
                                <Link to="/privacy" className="text-purple-600 hover:text-purple-500 font-medium">
                                    Política de Privacidad
                                </Link>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
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

                    {/* Divider y Google - Opcional remover */}
                    <div className="flex items-center my-8">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-4 text-gray-500 text-sm font-medium">O regístrate con</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    {/* OAuth Buttons - Opcional */}
                    <div className="space-y-4">
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-medium shadow-sm hover:shadow-md hover:border-gray-400 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
                        >
                            <FcGoogle className="text-xl" />
                            Google
                        </button>
                    </div>

                    {/* Login Link */}
                    <p className="mt-8 text-center text-sm text-gray-600">
                        ¿Ya tienes una cuenta?{" "}
                        <Link 
                            to="/sign-in" 
                            className="text-purple-600 hover:text-purple-500 font-semibold transition-colors"
                        >
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}