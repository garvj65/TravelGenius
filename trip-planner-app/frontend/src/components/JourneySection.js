import "./JourneySection.css";
import React from "react";

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
    <section className="journey-section">
      <div className="journey-header">
        <h2>Journey Inspirations from Travelers</h2>
        <p>
          Dive into unique <a href="#!">trip itineraries</a> crafted by our global travelers. Find your next adventure and share your own journey with fellow explorers.
        </p>
      </div>
      <div className="journey-cards">
        {trips.map((trip, index) => (
          <div className="journey-card" key={index}>
            <img 
              src={trip.image} 
              alt={trip.title}
              className="w-full h-64 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold">{trip.title}</h3>
              <p className="text-gray-600">By {trip.author}</p>
              <p className="mt-2">{trip.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default JourneySection;
