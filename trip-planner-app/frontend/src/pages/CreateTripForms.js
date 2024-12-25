import Header from "../components/Header";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function CreateTripForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    // Basic Info (Step 1)
    tripName: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    description: '',

    // Itinerary (Step 2)
    days: [{
      dayNumber: 1,
      location: '',
      activities: [{
        timeOfDay: 'Morning',
        title: '',
        description: ''
      }]
    }],

    // Hotels (Step 3)
    hotels: [{
      name: '',
      checkIn: '',
      checkOut: '',
      location: '',
      price: '',
      bookingConfirmation: ''
    }],

    // Media (Step 4)
    media: [{
      type: 'image', // or 'video'
      url: '',
      caption: ''
    }]
  });

  // Validation functions
  const validateBasicInfo = () => {
    const errors = {};
    if (!formData.tripName.trim()) errors.tripName = 'Trip name is required';
    if (!formData.destination.trim()) errors.destination = 'Destination is required';
    if (!formData.startDate) errors.startDate = 'Start date is required';
    if (!formData.endDate) errors.endDate = 'End date is required';
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      errors.endDate = 'End date must be after start date';
    }
    return errors;
  };

  const validateItinerary = () => {
    const errors = {};
    formData.days.forEach((day, index) => {
      if (!day.location.trim()) {
        errors[`day${index}Location`] = `Location for Day ${day.dayNumber} is required`;
      }
      day.activities.forEach((activity, actIndex) => {
        if (!activity.title.trim()) {
          errors[`day${index}Activity${actIndex}`] = 'Activity title is required';
        }
      });
    });
    return errors;
  };

  // Form submission handlers
  const handleBasicInfoSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateBasicInfo();
    if (Object.keys(validationErrors).length === 0) {
      setCurrentStep(2);
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  };

  const handleItinerarySubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateItinerary();
    if (Object.keys(validationErrors).length === 0) {
      setCurrentStep(3);
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  };

  const handleHotelsSubmit = (e) => {
    e.preventDefault();
    // Add hotel validation if needed
    setCurrentStep(4);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create the trip in Supabase
      const { data: trip, error: tripError } = await supabase
        .from('trips')
        .insert([
          {
            name: formData.tripName,
            destination: formData.destination,
            start_date: formData.startDate,
            end_date: formData.endDate,
            budget: formData.budget,
            description: formData.description
          }
        ])
        .select()
        .single();

      if (tripError) throw tripError;

      // Create itinerary days
      const { error: daysError } = await supabase
        .from('trip_days')
        .insert(
          formData.days.map(day => ({
            trip_id: trip.id,
            day_number: day.dayNumber,
            location: day.location,
            activities: day.activities
          }))
        );

      if (daysError) throw daysError;

      // Create hotels
      if (formData.hotels.length > 0) {
        const { error: hotelsError } = await supabase
          .from('hotels')
          .insert(
            formData.hotels.map(hotel => ({
              trip_id: trip.id,
              ...hotel
            }))
          );

        if (hotelsError) throw hotelsError;
      }

      // Create media entries
      if (formData.media.length > 0) {
        const { error: mediaError } = await supabase
          .from('trip_media')
          .insert(
            formData.media.map(media => ({
              trip_id: trip.id,
              ...media
            }))
          );

        if (mediaError) throw mediaError;
      }

      // Navigate to the trip detail page
      navigate(`/trip/${trip.id}`);
    } catch (error) {
      console.error('Error creating trip:', error);
      setErrors({ submit: 'Failed to create trip. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper functions for form updates
  const addDay = () => {
    setFormData(prev => ({
      ...prev,
      days: [
        ...prev.days,
        {
          dayNumber: prev.days.length + 1,
          location: '',
          activities: [{
            timeOfDay: 'Morning',
            title: '',
            description: ''
          }]
        }
      ]
    }));
  };

  const addActivity = (dayIndex) => {
    const newDays = [...formData.days];
    newDays[dayIndex].activities.push({
      timeOfDay: 'Morning',
      title: '',
      description: ''
    });
    setFormData(prev => ({ ...prev, days: newDays }));
  };

  const addHotel = () => {
    setFormData(prev => ({
      ...prev,
      hotels: [
        ...prev.hotels,
        {
          name: '',
          checkIn: '',
          checkOut: '',
          location: '',
          price: '',
          bookingConfirmation: ''
        }
      ]
    }));
  };

  const addMedia = () => {
    setFormData(prev => ({
      ...prev,
      media: [
        ...prev.media,
        {
          type: 'image',
          url: '',
          caption: ''
        }
      ]
    }));
  };

  const saveDraft = async () => {
    try {
      const { error } = await supabase
        .from('trip_drafts')
        .insert([
          {
            form_data: formData,
            last_step: currentStep,
            updated_at: new Date()
          }
        ]);

      if (error) throw error;
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <Header />
        <div className="max-w-4xl mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Create New Trip</h1>
          <button
            onClick={saveDraft}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
          >
            Save Draft
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Progress Steps */}
        <div className="mb-8 flex justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex items-center ${
                currentStep >= step ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                ${currentStep >= step ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}
              >
                {step}
              </div>
              <div className="ml-2">
                {step === 1 && 'Basic Info'}
                {step === 2 && 'Itinerary'}
                {step === 3 && 'Hotels'}
                {step === 4 && 'Media'}
              </div>
            </div>
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <form onSubmit={handleBasicInfoSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Trip Name</label>
              <input
                type="text"
                value={formData.tripName}
                onChange={(e) => setFormData({ ...formData, tripName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
              {errors.tripName && (
                <p className="mt-1 text-sm text-red-600">{errors.tripName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Destination</label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Budget</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter budget amount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe your trip..."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Next
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Itinerary */}
        {currentStep === 2 && (
          <form onSubmit={handleItinerarySubmit} className="space-y-6">
            {formData.days.map((day, dayIndex) => (
              <div key={dayIndex} className="border rounded-lg p-4 space-y-4">
                <h3 className="text-lg font-medium">Day {day.dayNumber}</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    value={day.location}
                    onChange={(e) => {
                      const newDays = [...formData.days];
                      newDays[dayIndex].location = e.target.value;
                      setFormData({ ...formData, days: newDays });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                {day.activities.map((activity, activityIndex) => (
                  <div key={activityIndex} className="ml-4 space-y-2">
                    <select
                      value={activity.timeOfDay}
                      onChange={(e) => {
                        const newDays = [...formData.days];
                        newDays[dayIndex].activities[activityIndex].timeOfDay = e.target.value;
                        setFormData({ ...formData, days: newDays });
                      }}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option>Morning</option>
                      <option>Afternoon</option>
                      <option>Evening</option>
                    </select>

                    <input
                      type="text"
                      value={activity.title}
                      onChange={(e) => {
                        const newDays = [...formData.days];
                        newDays[dayIndex].activities[activityIndex].title = e.target.value;
                        setFormData({ ...formData, days: newDays });
                      }}
                      placeholder="Activity title"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addActivity(dayIndex)}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add Activity
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addDay}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700"
            >
              + Add Another Day
            </button>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Hotels */}
        {currentStep === 3 && (
          <form onSubmit={handleHotelsSubmit} className="space-y-6">
            {formData.hotels.map((hotel, index) => (
              <div key={index} className="border rounded-lg p-6 space-y-4 bg-white">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Hotel {index + 1}</h3>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newHotels = formData.hotels.filter((_, i) => i !== index);
                        setFormData({ ...formData, hotels: newHotels });
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hotel Name</label>
                    <input
                      type="text"
                      value={hotel.name}
                      onChange={(e) => {
                        const newHotels = [...formData.hotels];
                        newHotels[index].name = e.target.value;
                        setFormData({ ...formData, hotels: newHotels });
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      value={hotel.location}
                      onChange={(e) => {
                        const newHotels = [...formData.hotels];
                        newHotels[index].location = e.target.value;
                        setFormData({ ...formData, hotels: newHotels });
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
                    <input
                      type="date"
                      value={hotel.checkIn}
                      onChange={(e) => {
                        const newHotels = [...formData.hotels];
                        newHotels[index].checkIn = e.target.value;
                        setFormData({ ...formData, hotels: newHotels });
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Check-out Date</label>
                    <input
                      type="date"
                      value={hotel.checkOut}
                      onChange={(e) => {
                        const newHotels = [...formData.hotels];
                        newHotels[index].checkOut = e.target.value;
                        setFormData({ ...formData, hotels: newHotels });
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price per Night</label>
                    <input
                      type="number"
                      value={hotel.price}
                      onChange={(e) => {
                        const newHotels = [...formData.hotels];
                        newHotels[index].price = e.target.value;
                        setFormData({ ...formData, hotels: newHotels });
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Booking Confirmation #</label>
                    <input
                      type="text"
                      value={hotel.bookingConfirmation}
                      onChange={(e) => {
                        const newHotels = [...formData.hotels];
                        newHotels[index].bookingConfirmation = e.target.value;
                        setFormData({ ...formData, hotels: newHotels });
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addHotel}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700"
            >
              + Add Another Hotel
            </button>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            </div>
          </form>
        )}

        {/* Step 4: Media */}
        {currentStep === 4 && (
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            {formData.media.map((item, index) => (
              <div key={index} className="border rounded-lg p-6 space-y-4 bg-white">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Media {index + 1}</h3>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newMedia = formData.media.filter((_, i) => i !== index);
                        setFormData({ ...formData, media: newMedia });
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                      value={item.type}
                      onChange={(e) => {
                        const newMedia = [...formData.media];
                        newMedia[index].type = e.target.value;
                        setFormData({ ...formData, media: newMedia });
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">URL</label>
                    <input
                      type="url"
                      value={item.url}
                      onChange={(e) => {
                        const newMedia = [...formData.media];
                        newMedia[index].url = e.target.value;
                        setFormData({ ...formData, media: newMedia });
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                      placeholder={`Enter ${item.type} URL`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Caption</label>
                    <input
                      type="text"
                      value={item.caption}
                      onChange={(e) => {
                        const newMedia = [...formData.media];
                        newMedia[index].caption = e.target.value;
                        setFormData({ ...formData, media: newMedia });
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Add a caption"
                    />
                  </div>

                  {/* Preview */}
                  {item.url && (
                    <div className="mt-2">
                      {item.type === 'image' ? (
                        <img
                          src={item.url}
                          alt={item.caption}
                          className="max-h-40 rounded-lg"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                      ) : (
                        <video
                          src={item.url}
                          controls
                          className="max-h-40 rounded-lg"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addMedia}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700"
            >
              + Add More Media
            </button>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Creating Trip...' : 'Create Trip'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
