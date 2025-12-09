import { useEffect, useState } from "react";
import axios from "axios";

export default function Establishments() {
  const [establishments, setEstablishments] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/establishments")
      .then((res) => setEstablishments(res.data))
      .catch((err) => console.error("Error fetching establishments:", err));
  }, []);

  return (
    <section className="max-w-screen-xl mx-auto px-6 py-20 font-sans" id="establishments">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-2xl text-black font-semibold font-satisfy">
          Establecimientos
        </h2>
      </div>


      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {establishments.map((item) => (
          <div
            key={item.id}
            className="bg-white border hover:border-purple-600 rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
          >
            {/* Imagen */}
            <div className="flex items-center justify-center mb-4 overflow-hidden rounded-lg h-48">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Info */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-purple-600">
              {item.name}
            </h3>

            <p className="text-sm text-gray-600">{item.address}, {item.city}</p>
            <p className="text-sm text-gray-600">Tel: {item.phone}</p>

            {/* Capacidad */}
            <p className="text-sm text-gray-800 font-semibold mt-1">
              Capacidad: {item.capacity} personas
            </p>

            {/* Botón */}
            <div className="mt-4 flex justify-end">
              <a
                href="/sign-in"
                className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm hover:bg-purple-700 transition-colors"
              >
                Cotiza aquí
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
