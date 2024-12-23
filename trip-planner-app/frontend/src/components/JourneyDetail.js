import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function JourneyDetail() {
 const { journeyId } = useParams();
 const [activeDay, setActiveDay] = useState(1);
  const itinerary = {
   id: journeyId,
   title: `${journeyId.split('-').join(' ').toUpperCase()}`,
   lastUpdated: "2024 Oct 04",
   days: [
     {
       day: 1,
       location: "Tokyo",
       activities: [
         {
           time: "Morning",
           title: "Discovering Tokyo's Treasures",
           description: "Start your adventure at the iconic Tokyo Tower, where you can enjoy breathtaking views of the city from its observation deck. This landmark is not only a symbol of Tokyo but also offers a glimpse into the city's modern architecture. Afterward, take a short walk to the nearby Zojoji Temple, a serene spot that contrasts beautifully with the bustling city."
         },
         {
           time: "Afternoon",
           title: "Cultural Immersion",
           description: "Explore the traditional district of Asakusa, home to the ancient Senso-ji Temple..."
         },
         // Add more activities
       ]
     },
     // Add more days
   ]
 };
  return (
   <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-all duration-300">
     <div className="max-w-7xl mx-auto px-4 py-8">
       {/* Header */}
       <div className="flex justify-between items-center mb-8">
         <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
           {itinerary.title}
         </h1>
         <div className="text-gray-600 dark:text-gray-400">
           Last updated: {itinerary.lastUpdated}
         </div>
       </div>
        {/* Day selector */}
       <div className="flex gap-4 mb-8">
         {itinerary.days.map((day) => (
           <button
             key={day.day}
             onClick={() => setActiveDay(day.day)}
             className={`px-4 py-2 rounded-lg transition-all duration-300 ${
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
   </div>
 );
}
