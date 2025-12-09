import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("/servicesData.json")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error("Failed to load services data:", err));
  }, []);

  return (
    <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10 sm:py-20 font-sans">
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl text-black font-semibold font-satisfy">
          Services We Offer
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white border p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl active:shadow-xl"
          >
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-1/3 flex-shrink-0">
                <img
                  src={service.image}
                  alt={service.title}
                  className="object-cover w-full h-56 sm:h-full rounded-xl"
                />
              </div>

              <div className="w-full sm:w-2/3 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 font-poppins">
                    {service.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 font-poppins leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* QUITÉ EL P DEL COSTO */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6">
                  <Link
                    to={`/event/${service.id}`}
                    className="w-full sm:w-auto border-2 border-black text-black px-6 py-2.5 rounded-full font-medium hover:bg-black hover:text-white transition-colors duration-300 text-center"
                  >
                    See Details
                  </Link>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
