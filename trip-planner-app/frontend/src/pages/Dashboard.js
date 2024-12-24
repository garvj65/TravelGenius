import Footer from "../components/Footer";
import Header from "../components/Header";
import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const recentTrips = [
    {
      id: "tokyo-adventure-march",
      title: "Tokyo Adventure",
      date: "2024-03-15",
      image: "/images/tokyo.jpg",
      duration: "5 days",
      description: "Explore the vibrant streets of Tokyo, from ancient temples to modern attractions.",
      highlights: ["Shibuya Crossing", "Senso-ji Temple", "Tokyo Tower"]
    },
    {
      id: "dubai-escape",
      title: "Dubai Escape",
      date: "2024-04-20",
      image: "/images/dubai.jpg",
      duration: "7 days",
      description: "Experience luxury and adventure in the heart of the UAE.",
      highlights: ["Burj Khalifa", "Desert Safari", "Dubai Mall"]
    }
    // Add more recent trips as needed
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-all duration-300">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Create Your Next Adventure
        </h1>

        {/* Trip Creation Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Form Option */}
          <Link to="/create-trip/form" 
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Create with Form
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Plan your trip step by step using our intuitive form interface.
            </p>
            <span className="text-blue-500 hover:text-blue-600">
              Get Started →
            </span>
          </Link>

          {/* Sinbad Option */}
          <Link to="/create-trip/chat" 
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Chat with Sinbad
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Let our AI travel companion help you plan your perfect trip.
            </p>
            <span className="text-blue-500 hover:text-blue-600">
              Start Chat →
            </span>
          </Link>
        </div>

        {/* Recent Trips */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Recently Viewed/Created Trips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentTrips.map((trip, index) => (
              <Link 
                to={`/journey/${trip.id}`} 
                key={index}
                className="group relative bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transform hover:scale-105 transition-all duration-300"
              >
                <div className="relative h-48">
                  <img 
                    src={trip.image} 
                    alt={trip.title} 
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-white text-center p-4">
                      <p className="font-semibold mb-2">{trip.duration}</p>
                      <p className="text-sm mb-2">{trip.description}</p>
                      <div className="text-xs">
                        {trip.highlights.map((highlight, i) => (
                          <span key={i} className="inline-block bg-white bg-opacity-20 rounded px-2 py-1 m-1">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {trip.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Created: {trip.date}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
