import Header from "../components/Header";
import React, { useState } from "react";
import supabase from "../supabase";
import { useNavigate } from "react-router-dom";

export default function CreateTripForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    cityName: '',
    startDate: '',
    endDate: '',
    imageUrl: '',
    days: [
      {
        dayNumber: 1,
        location: '',
        activities: [
          {
            timeOfDay: 'Morning',
            title: '',
            description: ''
          }
        ]
      }
    ],
    hotels: [
      {
        name: '',
        type: 'Luxury',
        description: '',
        rating: 5.0,
        imageUrl: '',
        bookingLink: ''
      }
    ],
    videos: [
      {
        title: '',
        thumbnailUrl: '',
        videoUrl: ''
      }
    ]
  });

  const handleBasicInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: trip, error } = await supabase
        .from('trips')
        .insert([
          {
            title: formData.title,
            city_name: formData.cityName,
            start_date: formData.startDate,
            end_date: formData.endDate,
            image_url: formData.imageUrl
          }
        ])
        .select()
        .single();

      if (error) throw error;

      if (trip) {
        setFormData(prev => ({ ...prev, tripId: trip.id }));
        setCurrentStep(2);
        navigate(`/trip/${trip.id}`);
      }
    } catch (error) {
      console.error('Error creating trip:', error);
      alert('Failed to create trip');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Create New Trip
        </h1>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {['Basic Info', 'Itinerary', 'Accommodations', 'Media'].map((step, index) => (
            <div
              key={index}
              className={`flex items-center ${
                currentStep > index + 1 ? 'text-green-500' : 
                currentStep === index + 1 ? 'text-blue-500' : 'text-gray-400'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                ${currentStep > index + 1 ? 'border-green-500 bg-green-100' :
                  currentStep === index + 1 ? 'border-blue-500 bg-blue-100' :
                  'border-gray-400'}`}
              >
                {currentStep > index + 1 ? '✓' : index + 1}
              </div>
              <span className="ml-2">{step}</span>
              {index < 3 && <div className="w-12 h-0.5 mx-2 bg-gray-300" />}
            </div>
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <form onSubmit={handleBasicInfoSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Trip Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                City
              </label>
              <input
                type="text"
                required
                value={formData.cityName}
                onChange={e => setFormData(prev => ({ ...prev, cityName: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={e => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Cover Image URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={e => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Next Step
              </button>
            </div>
          </form>
        )}

        {/* Additional steps will be added here */}
      </main>
    </div>
  );
}
