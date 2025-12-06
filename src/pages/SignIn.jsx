import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginRequest } from "../api/auth"; 
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  
const handleEmailSignIn = async (e) => {
  e.preventDefault();
  console.log(" Iniciando login...");
  
  if (!formData.email || !formData.password) {
    toast.error("Por favor completa todos los campos");
    setIsLoading(false);
    return;
  }

  try {
    const response = await loginRequest(formData.email, formData.password);
    console.log(" Respuesta completa del login:", response.data);
   
    if (response.data.token && response.data.user) {

      login(response.data.token, response.data.user);
      
     
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      console.log(" Redirigiendo según tipo:", response.data.user.type);
      
      // Redirigir según el tipo
      if (response.data.user.type === "ADMIN") {
        toast.success("¡Bienvenido Administrador!");
        navigate("/admin/dashboard");
      } else {
        toast.success("¡Bienvenido de vuelta!");
        navigate("/");
      }
    } else {
      toast.error("Error: respuesta del servidor incompleta");
    }
  } catch (error) {
       console.log(" Errores");
  } finally {
    setIsLoading(false);
  }
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
              Bienvenido
            </h1>
            <p className="text-gray-600 mt-2">Inicia sesión en tu cuenta</p>
          </div>

          {/* Email/Password Form */}
          <form className="space-y-6" onSubmit={handleEmailSignIn}>
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
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-600">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                />
                <span className="ml-2">Recordarme</span>
              </label>
              <Link 
                to="/forgot-password" 
                className="text-sm text-purple-600 hover:text-purple-500 transition-colors font-medium"
              >
                ¿Olvidaste tu contraseña?
              </Link>
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
                  Iniciando sesión...
                </div>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm font-medium">O continúa con</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

        
          {/* Sign Up Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link 
              to="/sign-up" 
              className="text-purple-600 hover:text-purple-500 font-semibold transition-colors"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}