import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";

export function ItineraryGenerator({ tripId, onItineraryGenerated }) {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    style: 'balanced',
    pace: 'moderate',
    interests: []
  });

  const interestOptions = [
    'Culture', 'Food', 'Nature', 'Shopping', 
    'History', 'Art', 'Adventure', 'Relaxation'
  ];

  const handleInterestToggle = (interest) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const generateItinerary = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:5000/api/trips/${tripId}/generate-itinerary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(preferences)
      });
      
      const data = await response.json();
      onItineraryGenerated(data.itinerary);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Generate Itinerary</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Travel Style
          </label>
          <select
            value={preferences.style}
            onChange={(e) => setPreferences({...preferences, style: e.target.value})}
            className="w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="budget">Budget-friendly</option>
            <option value="balanced">Balanced</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Travel Pace
          </label>
          <select
            value={preferences.pace}
            onChange={(e) => setPreferences({...preferences, pace: e.target.value})}
            className="w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="relaxed">Relaxed</option>
            <option value="moderate">Moderate</option>
            <option value="intense">Intense</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interests
          </label>
          <div className="flex flex-wrap gap-2">
            {interestOptions.map((interest) => (
              <button
                key={interest}
                onClick={() => handleInterestToggle(interest)}
                className={`px-3 py-1 rounded-full text-sm ${
                  preferences.interests.includes(interest)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generateItinerary}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Generating...' : 'Generate Itinerary'}
        </button>
      </div>
    </div>
  );
} 