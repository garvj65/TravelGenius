import Footer from "../components/Footer";
import Header from "../components/Header";
import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const recentTrips = [
    {
      title: "Tokyo Adventure",
      date: "2024-03-15",
      image: "/images/tokyo.jpg"
    },
    // Add more recent trips
    {
      title: "Okinawa Trip",
      date: "2024-10-15",
      image: "/images/tokyo.jpg"
    }
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
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <img 
                  src={trip.image} 
                  alt={trip.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {trip.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Created: {trip.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
