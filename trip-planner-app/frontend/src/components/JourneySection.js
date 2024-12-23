import "./JourneySection.css";
import React from "react";
import { Link } from "react-router-dom";

const trips = [
  {
    title: "Trip to Tokyo",
    author: "Ivanner Mora",
    description:
      "Join me on an exciting 10-day journey through Tokyo, where we'll visit iconic landmarks, indulge in delicious cuisine, and immerse ourselves in the vibrant culture of Japan's capital city.",
    image: "/images/tokyo.jpg",
  },
  {
    title: "Trip to Dubai",
    author: "John Mathew",
    description:
      "Embark on a thrilling 6-day journey through Dubai, United Arab Emirates. Explore vibrant souks, iconic landmarks, world-class shopping, and enchanting attractions.",
    image: "/images/dubai.jpg",
  },
  {
    title: "Trip to New York",
    author: "Pablo Guzman",
    description:
      "Experience the best of New York City in just 7 days! Explore iconic landmarks, indulge in delicious meals, and immerse yourself in the vibrant culture of the city that never sleeps.",
    image: "/images/newyork.jpg",
  },
  {
    title: "Trip to Rome",
    author: "Rosarinho Alves",
    description:
      "Join me on a thrilling 5-day adventure in Rome, where we'll explore ancient ruins, marvel at stunning architecture, and enjoy authentic Italian cuisine.",
    image: "/images/rome.jpg",
  },
];

const JourneySection = () => {
  return (
    <section className="journey-section bg-gray-100 dark:bg-gray-900 transition-all duration-300 ease-in-out py-16">
      <div className="journey-header text-center px-4 mb-12">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white transition-colors duration-300">
          Journey Inspirations from Travelers
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 transition-colors duration-300">
          Dive into unique <a href="#!" className="text-green-500 hover:text-green-600 transition-colors duration-300">trip itineraries</a> crafted by our global travelers. Find your next adventure and share your own journey with fellow explorers.
        </p>
      </div>
      <div className="journey-cards max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {trips.map((trip, index) => (
          <Link 
            to={`/journey/${trip.title.toLowerCase().replace(/\s+/g, '-')}`} 
            key={index}
          >
            <div className="journey-card bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 ease-in-out">
              <img 
                src={trip.image} 
                alt={trip.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                  {trip.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">
                  By {trip.author}
                </p>
                <p className="mt-4 text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  {trip.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default JourneySection;
