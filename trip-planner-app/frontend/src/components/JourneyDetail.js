import Header from "./Header";
import React, { useState } from "react";
import VideoModal from "./VideoModal";
import { useParams } from "react-router-dom";

export default function JourneyDetail() {
  const { journeyId } = useParams();
  const [activeDay, setActiveDay] = useState(1);
  const [activeVideo, setActiveVideo] = useState(null);

  const journeyData = {
    'tokyo-adventure-march': {
      id: 'tokyo-adventure-march',
      cityName: 'Tokyo',
      title: 'Tokyo Adventure',
      lastUpdated: "2024 Mar 15",
      image: "/images/tokyo.jpg",
      days: [
        {
          day: 1,
          location: "Shinjuku",
          activities: [
            {
              time: "Morning",
              title: "Tokyo Metropolitan Building",
              description: "Start your day with free panoramic views of Tokyo."
            },
            {
              time: "Afternoon",
              title: "Shinjuku Gyoen",
              description: "Explore one of Tokyo's largest and most beautiful parks."
            }
          ]
        },
        {
          day: 2,
          location: "Asakusa",
          activities: [
            {
              time: "Morning",
              title: "Senso-ji Temple",
              description: "Visit Tokyo's oldest Buddhist temple and explore the traditional shopping street Nakamise."
            },
            {
              time: "Afternoon",
              title: "Tokyo Skytree",
              description: "Take in breathtaking views from Japan's tallest structure and enjoy shopping at the base."
            }
          ]
        }
      ],
      hotels: [
        {
          name: 'The Prince Gallery Tokyo Kioicho',
          type: 'Luxury',
          description: 'A luxury collection hotel offering a great mix of comfort and convenience.',
          rating: 4.8,
          image: '/images/hotels/tokyo-prince.jpg',
          bookingLink: '#'
        },
        {
          name: 'The Capitol Hotel Tokyu',
          type: 'Premium',
          description: 'Featuring premium amenities and exceptional service.',
          rating: 4.6,
          image: '/images/hotels/tokyo-capitol.jpg',
          bookingLink: '#'
        },
        {
          name: 'Wise Owl Hostels River Tokyo',
          type: 'Budget',
          description: 'Providing basic comforts without breaking the bank.',
          rating: 4.3,
          image: '/images/hotels/tokyo-hostel.jpg',
          bookingLink: '#'
        }
      ],
      videos: [
        {
          title: "Tokyo Travel Guide - Must-See Attractions",
          thumbnail: "/images/videos/tokyo-guide.jpg",
          url: "https://www.youtube.com/embed/hLlpWqT5G8k"
        },
        {
          title: "Top 10 Things to Do in Tokyo",
          thumbnail: "/images/videos/tokyo-things.jpg",
          url: "https://www.youtube.com/embed/0nTO4zqEpw8"
        }
      ]
    },
    'trip-to-dubai': {
      id: 'trip-to-dubai',
      cityName: 'Dubai',
      title: 'TRIP TO DUBAI',
      lastUpdated: "2024 Oct 04",
      image: "/images/dubai.jpg",
      days: [
        {
          day: 1,
          location: "Downtown Dubai",
          activities: [
            {
              time: "Morning",
              title: "Burj Khalifa",
              description: "Start your Dubai adventure at the world's tallest building. Visit the observation deck for stunning city views."
            },
            {
              time: "Afternoon",
              title: "Dubai Mall",
              description: "Explore the world's largest mall, featuring the Dubai Aquarium and Underwater Zoo."
            },
            {
              time: "Evening",
              title: "Dubai Fountain Show",
              description: "Watch the spectacular water, light, and music show at the world's largest choreographed fountain system."
            }
          ]
        },
        {
          day: 2,
          location: "Old Dubai",
          activities: [
            {
              time: "Morning",
              title: "Dubai Creek",
              description: "Take an abra (traditional boat) ride across the creek and explore the historic waterway."
            },
            {
              time: "Afternoon",
              title: "Gold and Spice Souks",
              description: "Wander through traditional markets selling gold jewelry and aromatic spices."
            }
          ]
        }
      ],
      hotels: [
        {
          name: 'Burj Al Arab Jumeirah',
          type: 'Ultra Luxury',
          description: 'Iconic sail-shaped hotel offering unparalleled luxury and service.',
          rating: 4.9,
          image: '/images/hotels/dubai-burj.jpg',
          bookingLink: '#'
        },
        {
          name: 'Atlantis The Palm',
          type: 'Luxury',
          description: 'Ocean-themed resort with water park and marine attractions.',
          rating: 4.7,
          image: '/images/hotels/dubai-atlantis.jpg',
          bookingLink: '#'
        },
        {
          name: 'Rove Downtown Dubai',
          type: 'Mid-Range',
          description: 'Modern hotel with great location and value for money.',
          rating: 4.4,
          image: '/images/hotels/dubai-rove.jpg',
          bookingLink: '#'
        }
      ],
      videos: [
        {
          title: "Dubai City Tour - Top Attractions",
          thumbnail: "/images/videos/dubai-guide.jpg",
          url: "#"
        },
        {
          title: "Dubai Desert Safari Experience",
          thumbnail: "/images/videos/dubai-desert.jpg",
          url: "#"
        }
      ]
    }
  };

  const itinerary = journeyData[journeyId] || {
    id: journeyId,
    title: 'Journey Not Found',
    lastUpdated: "N/A",
    image: "",
    days: [],
    hotels: [],
    videos: []
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-all duration-300">
      <Header />
      
      {/* Banner Image */}
      <div className="relative h-[300px] w-full overflow-hidden">
        <img 
          src={itinerary.image} 
          alt={itinerary.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">
            {itinerary.title}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Last Updated */}
        <div className="text-gray-600 dark:text-gray-400 mb-8">
          Last updated: {itinerary.lastUpdated}
        </div>

        {/* Day selector */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {itinerary.days.map((day) => (
            <button
              key={day.day}
              onClick={() => setActiveDay(day.day)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 flex-shrink-0 ${
                activeDay === day.day
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Day {day.day}
              <span className="block text-sm">{day.location}</span>
            </button>
          ))}
        </div>

        {/* Day content */}
        {itinerary.days
          .find((day) => day.day === activeDay)
          ?.activities.map((activity, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 transition-all duration-300"
            >
              <div className="text-gray-600 dark:text-gray-400 mb-2">
                {activity.time}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {activity.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {activity.description}
              </p>
            </div>
          ))}
      </div>

      {/* Where to Stay Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Where to stay in {itinerary.cityName}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {itinerary.hotels.map((hotel, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <img 
                src={hotel.image} 
                alt={hotel.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">
                    {hotel.rating} ★
                  </span>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {hotel.type}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {hotel.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {hotel.description}
                </p>
                <a
                  href={hotel.bookingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors duration-300"
                >
                  Book Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Travel Videos Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Top {itinerary.cityName} Travel Videos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {itinerary.videos.map((video, index) => (
            <button
              key={index}
              onClick={() => setActiveVideo(video.url)}
              className="block bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
            >
              <img 
                src={video.thumbnail} 
                alt={video.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {video.title}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Video Modal */}
      {activeVideo && (
        <VideoModal
          videoUrl={activeVideo}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </div>
  );
}
