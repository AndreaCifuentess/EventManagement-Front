import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

    useEffect(() => {
      // nothing needed: user comes from context
    }, [user]);


  const handleLogout = async () => {
    logout();
    navigate("/sign-in");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-full px-4 py-3 flex justify-between items-center bg-white shadow-sm font-poppins relative z-50">
      <div>
        <Link to="/">
          <img
            src="https://github.com/newdevatgit/event-management-ui/blob/main/public/logo.png?raw=true"
            alt="Eventique"
            className="h-[60px] w-auto object-fill"
          />
        </Link>
      </div>

      <button 
        onClick={toggleMenu} 
        className="md:hidden z-50 relative"
        aria-label="Toggle menu"
      >
        <svg 
          className={`w-6 h-6 ${isMenuOpen ? 'stroke-white' : 'stroke-current'}`} 
          fill="none" 
          viewBox="0 0 24 24"
        >
          {isMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Full screen overlay menu */}
      <div className={`${
        isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      } md:hidden fixed inset-0 bg-black bg-opacity-95 transition-all duration-300 ease-in-out z-40`}>
        <div className="flex flex-col items-center justify-center h-full">
          <ul className="flex flex-col items-center space-y-8 text-2xl text-white mb-12">
            <li><Link onClick={toggleMenu} to="/" className="hover:text-purple-500 transition-colors">Home</Link></li>
            <li><Link onClick={toggleMenu} to="/categories" className="hover:text-purple-500 transition-colors">Categories</Link></li>
            <li><Link onClick={toggleMenu} to="/services" className="hover:text-purple-500 transition-colors">Services</Link></li>
            <li><Link onClick={toggleMenu} to="/contact" className="hover:text-purple-500 transition-colors">Contact</Link></li>
          </ul>

          <div className="flex flex-col items-center space-y-4 w-64">
            {!user ? (
              <>
                <Link
                  onClick={toggleMenu}
                  to="/sign-in"
                  className="w-full border border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-black transition-colors text-center"
                >
                  Log in
                </Link>
                <Link
                  onClick={toggleMenu}
                  to="/sign-up"
                  className="w-full bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors text-center"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                <Link
                  onClick={toggleMenu}
                  to="/cart"
                  className="w-full border border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-black transition-colors text-center"
                >
                  My Cart
                </Link>
                <Link
                  onClick={toggleMenu}
                  to="/my-reservations"
                  className="w-full border border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-black transition-colors text-center"
                >
                  Mis reserve
                </Link>
                <Link
                  onClick={toggleMenu}
                  to="/profile"
                  className="w-full border border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-black transition-colors text-center"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white px-6 py-3 rounded-full font-medium hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Desktop menu */}
      <ul className="hidden md:flex space-x-8 text-md font-medium text-black">
        <li><Link to="/" className="hover:text-purple-500">Home</Link></li>
        <li><Link to="/categories" className="hover:text-purple-500">Categories</Link></li>
        <li><Link to="/services" className="hover:text-purple-500">Services</Link></li>
        <li><Link to="/contact" className="hover:text-purple-500">Contact</Link></li>
      </ul>

      <div className="hidden md:flex space-x-3">
        {!user ? (
          <>
            <Link
              to="/sign-in"
              className="border border-black text-black px-4 py-2 rounded-full font-medium hover:bg-gray-100"
            >
              Log in
            </Link>
            <Link
              to="/sign-up"
              className="bg-black text-white px-4 py-2 rounded-full font-medium hover:bg-gray-900"
            >
              Sign up
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/cart"
              className="text-black border border-gray-300 px-4 py-2 rounded-full font-medium hover:bg-gray-100"
            >
              My Cart
            </Link>
            <Link
              to="/my-reservations"
              className="text-black border border-gray-300 px-4 py-2 rounded-full font-medium hover:bg-gray-100"
            >
              My reserve
            </Link>
            <Link
              to="/profile"
              className="text-black border border-gray-300 px-4 py-2 rounded-full font-medium hover:bg-gray-100"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-full font-medium hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
