import React, { useEffect, useState } from "react";
import supabase from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { tripService } from "../services/api";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [flightDetails, setFlightDetails] = useState({
    origin: '',
    destination: '',
    date: ''
  });
  const [flights, setFlights] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const { user } = useAuth();
  const [context, setContext] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Fetch conversation history on component mount
  useEffect(() => {
    loadConversationHistory();
  }, []);

  const loadConversationHistory = async () => {
    try {
      const history = await tripService.getConversations();
      setMessages(history.map(conv => ({
        user: conv.user_message,
        ai: conv.ai_response
      })));
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const handleContextChange = (e) => {
    setContext(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      const fullPrompt = context 
        ? `Context: ${context}\nUser Query: ${input}`
        : input;

      const response = await tripService.generateItinerary(fullPrompt, messages);
      
      // Store in Supabase if user is authenticated
      if (user) {
        await supabase
          .from('conversations')
          .insert([{
            user_id: user.id,
            user_message: input,
            ai_response: response.message,
            context: context || null
          }]);
      }

      setMessages([...messages, { user: input, ai: response.message }]);
      setInput('');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFlightSearch = async () => {
    try {
      const response = await tripService.searchFlights(flightDetails.origin, flightDetails.destination, flightDetails.date);
      setFlights(response.data.data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chat Section */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="font-bold text-xl mb-4">Sinbad TravelThinker</div>
          <div className="h-96 overflow-y-auto mb-4 space-y-4 border-b border-gray-200">
            {messages.map((msg, idx) => (
              <div key={idx}>
                <div className="bg-blue-100 p-3 rounded-lg mb-2">
                  <p className="font-semibold">You:</p>
                  <p>{msg.user}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="font-semibold">Assistant:</p>
                  <p>{msg.ai}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your trip..."
              className="flex-1 p-2 border rounded"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? 'Thinking...' : 'Send'}
            </button>
          </form>
        </div>

        {/* Flight Search Section */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="font-bold text-xl mb-4">Flight Search</div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Origin (e.g., LAX)"
              value={flightDetails.origin}
              onChange={(e) => setFlightDetails({
                ...flightDetails,
                origin: e.target.value.toUpperCase()
              })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Destination (e.g., NYC)"
              value={flightDetails.destination}
              onChange={(e) => setFlightDetails({
                ...flightDetails,
                destination: e.target.value.toUpperCase()
              })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={flightDetails.date}
              onChange={(e) => setFlightDetails({
                ...flightDetails,
                date: e.target.value
              })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleFlightSearch}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Search Flights
            </button>
          </div>

          {flights.length > 0 && (
            <div className="mt-4 space-y-2">
              {flights.map((flight, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <p className="font-medium">
                    {flight.itineraries[0].segments[0].departure.iataCode} →{' '}
                    {flight.itineraries[0].segments[0].arrival.iataCode}
                  </p>
                  <p className="text-sm text-gray-600">
                    Price: {flight.price.total} {flight.price.currency}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Conversation History Section */}
        <div className="bg-white rounded-lg shadow-lg p-4 col-span-1 md:col-span-2">
          <div className="font-bold text-xl mb-4">Recent Conversations</div>
          <div className="space-y-4">
            {conversationHistory.map((conv, index) => (
              <div key={index} className="border-b border-gray-200 pb-2">
                <p className="text-sm text-gray-600">
                  {new Date(conv.timestamp).toLocaleDateString()}
                </p>
                <p className="font-medium">You: {conv.user_message}</p>
                <p className="text-gray-700">Assistant: {conv.ai_response}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;