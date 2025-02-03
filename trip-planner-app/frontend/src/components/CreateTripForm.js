import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function CreateTripForm() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const response = await fetch('http://localhost:5000/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create trip');

      const trip = await response.json();
      navigate(`/trips/${trip.id}`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Destination</label>
          <input
            type="text"
            value={formData.destination}
            onChange={(e) => setFormData({...formData, destination: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Budget</label>
          <input
            type="number"
            value={formData.budget}
            onChange={(e) => setFormData({...formData, budget: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            rows="3"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Create Trip
        </button>
      </div>
    </form>
  );
} 