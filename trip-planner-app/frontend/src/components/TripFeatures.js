import React from "react";

// src/components/TripFeatures.js

const TripFeatures = () => {
  const features = [
    {
      title: "Optimal Route Planning",
      description:
        "Our algorithms analyze your preferences to craft the most efficient route, saving you time and effort.",
      icon: "🗺️",
    },
    {
      title: "Personalized Adventure",
      description:
        "Shape your journey by freely adding, editing, or deleting activities from your itinerary.",
      icon: "✍️",
    },
    {
      title: "Local Cuisine Recommendations",
      description:
        "Discover local cuisines and hidden gems recommended by our AI, tailored to your taste buds.",
      icon: "🍴",
    },
    {
      title: "Smart Packing Assistant",
      description:
        "Get packing suggestions based on your destination, weather, and planned activities.",
      icon: "🎒",
    },
    {
      title: "Sights and Attractions Finder",
      description:
        "AI-curated recommendations for must-visit sights and attractions at your destination.",
      icon: "🏞️",
    },
    {
      title: "Real-Time Weather Updates",
      description:
        "Stay ahead of the weather with real-time updates and suggestions to adapt your itinerary.",
      icon: "🌦️",
    },
    {
      title: "Budget Tracking & Optimization",
      description:
        "Set a budget and let our planner suggest cost-effective options to maximize your travel experience.",
      icon: "💰",
    },
    {
      title: "Integrated Travel Guides",
      description:
        "Access detailed travel guides for each location, including cultural insights, do's and don'ts, and tips.",
      icon: "📖",
    },
    {
      title: "Eco-Friendly Travel Options",
      description:
        "Discover sustainable travel choices, including eco-friendly transportation and accommodations.",
      icon: "🌱",
    },
  ];

  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          <span className="text-blue-500 dark:text-blue-400 transition-colors duration-300">Your AI-Powered Trip</span> 
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300"
            >
              <div className="text-5xl mb-4 transition-transform duration-300">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TripFeatures;
