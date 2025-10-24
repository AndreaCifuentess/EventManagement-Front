import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch("/servicesData.json")
      .then((res) => res.json())
      .then((data) => {
        const matchedEvent = data.find((item) => item.id === Number(id));
        setEvent(matchedEvent);
      })
      .catch((err) => console.error("Error loading event data:", err));
  }, [id]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please sign in to add items to your cart.");
      navigate("/sign-in");
      return;
    }

    try {
      setAdding(true);
      const cartRef = doc(db, "users", user.uid, "cart", `event-${event.id}`);
      await setDoc(cartRef, {
        ...event,
        addedAt: new Date(),
      });
      alert("Event added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add to cart.");
    } finally {
      setAdding(false);
    }
  };

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-lg text-red-500 font-medium">
        Event not found!
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 py-12 font-poppins">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        {/* Image Section */}
        <div className="relative">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-64 md:h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-green-600 text-white text-sm font-medium px-4 py-1 rounded-full shadow-md">
            {event.category || "Featured Event"}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {event.title}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {event.description}
            </p>

            <div className="space-y-3 text-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-2">
                <span className="font-semibold text-gray-800">Location</span>
                <span className="text-gray-500">{event.location}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-2">
                <span className="font-semibold text-gray-800">Duration</span>
                <span className="text-gray-500">{event.duration}</span>
              </div>
            </div>

            <p className="text-2xl font-semibold text-green-700 mt-6">
              ₹{event.cost}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="mt-8 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
