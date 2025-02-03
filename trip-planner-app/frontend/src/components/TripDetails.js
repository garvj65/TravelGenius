import { useAuth } from "@clerk/clerk-react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function TripDetails() {
  const { tripId } = useParams();
  const { getToken } = useAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [itinerary, setItinerary] = useState(null);

  const fetchTripDetails = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:5000/api/trips/${tripId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setTrip(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [tripId, getToken]);

  useEffect(() => {
    fetchTripDetails();
  }, [fetchTripDetails]);

  const generateItinerary = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:5000/api/trips/${tripId}/generate-itinerary`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setItinerary(data.itinerary);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!trip) return <div>Trip not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">{trip.title}</h1>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600">Destination</p>
            <p className="font-medium">{trip.destination}</p>
          </div>
          <div>
            <p className="text-gray-600">Status</p>
            <p className="font-medium capitalize">{trip.status}</p>
          </div>
          <div>
            <p className="text-gray-600">Dates</p>
            <p className="font-medium">
              {new Date(trip.startDate).toLocaleDateString()} - 
              {new Date(trip.endDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Budget</p>
            <p className="font-medium">${trip.budget}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{trip.description}</p>
        </div>

        {!itinerary && (
          <button
            onClick={generateItinerary}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Generate Itinerary
          </button>
        )}

        {itinerary && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">AI Generated Itinerary</h2>
            <div className="prose max-w-none">
              {itinerary.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {trip.activities && trip.activities.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Activities</h2>
          <div className="space-y-4">
            {trip.activities.map((activity) => (
              <div key={activity.id} className="border-b pb-4">
                <h3 className="font-medium">Day {activity.day}: {activity.title}</h3>
                <p className="text-gray-600">{activity.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  <span>{new Date(activity.startTime).toLocaleTimeString()}</span>
                  <span className="mx-2">•</span>
                  <span>{activity.duration} minutes</span>
                  <span className="mx-2">•</span>
                  <span>${activity.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 