import React, { useState } from "react";
import { Calendar, MapPin, MessageSquare, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const TravelGenius = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [flightDetails, setFlightDetails] = useState({
    origin: '',
    destination: '',
    date: ''
  });
  const [flights, setFlights] = useState([]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await response.json();
      
      setMessages([...messages, 
        { type: 'user', content: input },
        { type: 'assistant', content: data.generated_text }
      ]);
      
      // Fetch photos for the destination
      const photoResponse = await fetch(`http://localhost:5000/api/photos/${input.split(' ')[0]}`);
      const photoData = await photoResponse.json();
      setPhotos(photoData.results);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  const handleFlightSearch = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/flights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flightDetails),
      });
      const data = await response.json();
      setFlights(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chat Section */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Travel Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 overflow-y-auto mb-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-100 ml-auto max-w-[80%]'
                      : 'bg-gray-100 max-w-[80%]'
                  }`}
                >
                  {message.content}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your travel plans..."
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={loading}
              >
                Send
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Flight Search Section */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="w-5 h-5" />
              Flight Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Origin (e.g., LAX)"
                value={flightDetails.origin}
                onChange={(e) => setFlightDetails({
                  ...flightDetails,
                  origin: e.target.value
                })}
              />
              <Input
                placeholder="Destination (e.g., NYC)"
                value={flightDetails.destination}
                onChange={(e) => setFlightDetails({
                  ...flightDetails,
                  destination: e.target.value
                })}
              />
              <Input
                type="date"
                value={flightDetails.date}
                onChange={(e) => setFlightDetails({
                  ...flightDetails,
                  date: e.target.value
                })}
              />
              <Button onClick={handleFlightSearch} className="w-full">
                Search Flights
              </Button>
            </div>

            {flights.length > 0 && (
              <div className="space-y-2">
                {flights.map((flight, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <p className="font-medium">
                        {flight.itineraries[0].segments[0].departure.iataCode} →{' '}
                        {flight.itineraries[0].segments[0].arrival.iataCode}
                      </p>
                      <p className="text-sm text-gray-600">
                        Price: {flight.price.total} {flight.price.currency}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Photos Section */}
        {photos.length > 0 && (
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Destination Photos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo.urls.small}
                    alt={photo.alt_description}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TravelGenius;