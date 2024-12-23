import Header from "../components/Header";
import React, { useState } from "react";
import supabase from "../supabase";
import { useNavigate } from "react-router-dom";

const getYouTubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

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

  // Step 2: Itinerary Form
  const handleItinerarySubmit = async (e) => {
    e.preventDefault();
    try {
      // First, create the days
      const { data: days, error: daysError } = await supabase
        .from('trip_days')
        .insert(
          formData.days.map(day => ({
            trip_id: formData.tripId,
            day_number: day.dayNumber,
            location: day.location
          }))
        )
        .select();

      if (daysError) throw daysError;

      // Then, create activities for each day
      for (let day of days) {
        const dayActivities = formData.days.find(d => d.dayNumber === day.day_number).activities;
        await supabase
          .from('activities')
          .insert(
            dayActivities.map(activity => ({
              day_id: day.id,
              time_of_day: activity.timeOfDay,
              title: activity.title,
              description: activity.description
            }))
          );
      }

      setCurrentStep(3);
    } catch (error) {
      console.error('Error saving itinerary:', error);
      alert('Failed to save itinerary');
    }
  };

  // Add/Remove Day handlers
  const addDay = () => {
    setFormData(prev => ({
      ...prev,
      days: [
        ...prev.days,
        {
          dayNumber: prev.days.length + 1,
          location: '',
          activities: [{ timeOfDay: 'Morning', title: '', description: '' }]
        }
      ]
    }));
  };

  const removeDay = (dayIndex) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.filter((_, index) => index !== dayIndex)
    }));
  };

  // Add/Remove Activity handlers
  const addActivity = (dayIndex) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.map((day, index) => {
        if (index === dayIndex) {
          return {
            ...day,
            activities: [...day.activities, { timeOfDay: 'Morning', title: '', description: '' }]
          };
        }
        return day;
      })
    }));
  };

  const removeActivity = (dayIndex, activityIndex) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.map((day, index) => {
        if (index === dayIndex) {
          return {
            ...day,
            activities: day.activities.filter((_, aIndex) => aIndex !== activityIndex)
          };
        }
        return day;
      })
    }));
  };

  // Step 3: Hotels/Accommodations handlers
  const handleAccommodationsSubmit = async (e) => {
    e.preventDefault();
    try {
      await supabase
        .from('hotels')
        .insert(
          formData.hotels.map(hotel => ({
            trip_id: formData.tripId,
            name: hotel.name,
            type: hotel.type,
            description: hotel.description,
            rating: hotel.rating,
            image_url: hotel.imageUrl,
            booking_link: hotel.bookingLink
          }))
        );

      setCurrentStep(4);
    } catch (error) {
      console.error('Error saving accommodations:', error);
      alert('Failed to save accommodations');
    }
  };

  // Step 4: Media handlers
  const handleMediaSubmit = async (e) => {
    e.preventDefault();
    try {
      await supabase
        .from('trip_videos')
        .insert(
          formData.videos.map(video => ({
            trip_id: formData.tripId,
            title: video.title,
            thumbnail_url: video.thumbnailUrl,
            video_url: video.videoUrl
          }))
        );

      navigate(`/journey/${formData.tripId}`);
    } catch (error) {
      console.error('Error saving media:', error);
      alert('Failed to save media');
    }
  };

  // Hotel handlers
  const addHotel = () => {
    setFormData(prev => ({
      ...prev,
      hotels: [
        ...prev.hotels,
        {
          name: '',
          type: 'Luxury',
          description: '',
          rating: 5.0,
          imageUrl: '',
          bookingLink: ''
        }
      ]
    }));
  };

  const removeHotel = (index) => {
    setFormData(prev => ({
      ...prev,
      hotels: prev.hotels.filter((_, i) => i !== index)
    }));
  };

  // Video handlers
  const addVideo = () => {
    setFormData(prev => ({
      ...prev,
      videos: [
        ...prev.videos,
        {
          title: '',
          thumbnailUrl: '',
          videoUrl: '',
          previewUrl: ''
        }
      ]
    }));
  };

  const handleVideoUrlChange = (index, url) => {
    const newVideos = [...formData.videos];
    newVideos[index].videoUrl = url;
    
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
      newVideos[index].thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      newVideos[index].previewUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    
    setFormData(prev => ({ ...prev, videos: newVideos }));
  };

  const removeVideo = (index) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }));
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

        {/* Step 2: Itinerary */}
        {currentStep === 2 && (
          <form onSubmit={handleItinerarySubmit} className="space-y-8">
            {formData.days.map((day, dayIndex) => (
              <div key={dayIndex} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Day {day.dayNumber}</h3>
                  {formData.days.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDay(dayIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove Day
                    </button>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={day.location}
                    onChange={e => {
                      const newDays = [...formData.days];
                      newDays[dayIndex].location = e.target.value;
                      setFormData(prev => ({ ...prev, days: newDays }));
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-4">
                  {day.activities.map((activity, activityIndex) => (
                    <div key={activityIndex} className="border p-4 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <select
                          value={activity.timeOfDay}
                          onChange={e => {
                            const newDays = [...formData.days];
                            newDays[dayIndex].activities[activityIndex].timeOfDay = e.target.value;
                            setFormData(prev => ({ ...prev, days: newDays }));
                          }}
                          className="rounded-md border-gray-300"
                        >
                          <option>Morning</option>
                          <option>Afternoon</option>
                          <option>Evening</option>
                        </select>
                        {day.activities.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeActivity(dayIndex, activityIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove Activity
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        placeholder="Activity Title"
                        required
                        value={activity.title}
                        onChange={e => {
                          const newDays = [...formData.days];
                          newDays[dayIndex].activities[activityIndex].title = e.target.value;
                          setFormData(prev => ({ ...prev, days: newDays }));
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />

                      <textarea
                        placeholder="Description"
                        value={activity.description}
                        onChange={e => {
                          const newDays = [...formData.days];
                          newDays[dayIndex].activities[activityIndex].description = e.target.value;
                          setFormData(prev => ({ ...prev, days: newDays }));
                        }}
                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addActivity(dayIndex)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    + Add Activity
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={addDay}
                className="text-blue-500 hover:text-blue-700"
              >
                + Add Day
              </button>

              <div className="space-x-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Next
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Step 3: Accommodations */}
        {currentStep === 3 && (
          <form onSubmit={handleAccommodationsSubmit} className="space-y-6">
            <div className="space-y-6">
              {formData.hotels.map((hotel, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Hotel {index + 1}</h3>
                    {formData.hotels.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHotel(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove Hotel
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Hotel Name</label>
                      <input
                        type="text"
                        required
                        value={hotel.name}
                        onChange={e => {
                          const newHotels = [...formData.hotels];
                          newHotels[index].name = e.target.value;
                          setFormData(prev => ({ ...prev, hotels: newHotels }));
                        }}
                        className="w-full rounded-md border-gray-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Type</label>
                      <select
                        value={hotel.type}
                        onChange={e => {
                          const newHotels = [...formData.hotels];
                          newHotels[index].type = e.target.value;
                          setFormData(prev => ({ ...prev, hotels: newHotels }));
                        }}
                        className="w-full rounded-md border-gray-300"
                      >
                        <option>Luxury</option>
                        <option>Premium</option>
                        <option>Mid-Range</option>
                        <option>Budget</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        value={hotel.description}
                        onChange={e => {
                          const newHotels = [...formData.hotels];
                          newHotels[index].description = e.target.value;
                          setFormData(prev => ({ ...prev, hotels: newHotels }));
                        }}
                        className="w-full rounded-md border-gray-300"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Rating</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        step="0.1"
                        value={hotel.rating}
                        onChange={e => {
                          const newHotels = [...formData.hotels];
                          newHotels[index].rating = parseFloat(e.target.value);
                          setFormData(prev => ({ ...prev, hotels: newHotels }));
                        }}
                        className="w-full rounded-md border-gray-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Image URL</label>
                      <input
                        type="url"
                        value={hotel.imageUrl}
                        onChange={e => {
                          const newHotels = [...formData.hotels];
                          newHotels[index].imageUrl = e.target.value;
                          setFormData(prev => ({ ...prev, hotels: newHotels }));
                        }}
                        className="w-full rounded-md border-gray-300"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Booking Link</label>
                      <input
                        type="url"
                        value={hotel.bookingLink}
                        onChange={e => {
                          const newHotels = [...formData.hotels];
                          newHotels[index].bookingLink = e.target.value;
                          setFormData(prev => ({ ...prev, hotels: newHotels }));
                        }}
                        className="w-full rounded-md border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addHotel}
                className="text-blue-500 hover:text-blue-700"
              >
                + Add Another Hotel
              </button>
            </div>

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
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Next
              </button>
            </div>
          </form>
        )}

        {/* Step 4: Media */}
        {currentStep === 4 && (
          <form onSubmit={handleMediaSubmit} className="space-y-6">
            <div className="space-y-6">
              {formData.videos.map((video, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Video {index + 1}</h3>
                    {formData.videos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVideo(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove Video
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <input
                        type="text"
                        required
                        value={video.title}
                        onChange={e => {
                          const newVideos = [...formData.videos];
                          newVideos[index].title = e.target.value;
                          setFormData(prev => ({ ...prev, videos: newVideos }));
                        }}
                        className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter video title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Video URL</label>
                      <input
                        type="url"
                        required
                        value={video.videoUrl}
                        onChange={e => handleVideoUrlChange(index, e.target.value)}
                        className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter YouTube video URL"
                      />
                      {video.videoUrl && !getYouTubeVideoId(video.videoUrl) && (
                        <p className="text-red-500 text-sm mt-1">
                          Please enter a valid YouTube URL
                        </p>
                      )}
                    </div>

                    {/* Video Preview */}
                    {video.previewUrl && (
                      <div className="aspect-w-16 aspect-h-9 mt-4">
                        <iframe
                          src={video.previewUrl}
                          title={video.title}
                          className="w-full h-full rounded-lg"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Thumbnail URL 
                        {getYouTubeVideoId(video.videoUrl) && (
                          <span className="text-gray-500 text-xs ml-2">
                            (Auto-generated from YouTube)
                          </span>
                        )}
                      </label>
                      <input
                        type="url"
                        value={video.thumbnailUrl}
                        onChange={e => {
                          const newVideos = [...formData.videos];
                          newVideos[index].thumbnailUrl = e.target.value;
                          setFormData(prev => ({ ...prev, videos: newVideos }));
                        }}
                        className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter thumbnail URL (optional for YouTube videos)"
                        disabled={getYouTubeVideoId(video.videoUrl)}
                      />
                    </div>

                    {/* Thumbnail Preview */}
                    {video.thumbnailUrl && (
                      <div className="mt-2">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full max-w-md rounded-lg shadow"
                          onError={(e) => {
                            e.target.src = '/placeholder-thumbnail.jpg';
                            e.target.onerror = null;
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addVideo}
                className="inline-flex items-center text-blue-500 hover:text-blue-700"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Another Video
              </button>
            </div>

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Previous
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Finish
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
