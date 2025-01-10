import React, { useEffect, useState } from "react";
import axios from "axios";

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

  // Fetch conversation history on component mount
  useEffect(() => {
    fetchConversationHistory();
  }, []);

  const fetchConversationHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/chats');
      setConversationHistory(response.data);
    } catch (error) {
      console.error('Error fetching conversation history:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/itinerary', {
        prompt: input,
        conversationHistory: messages.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      });

      const newMessages = [
        ...messages,
        { type: 'user', content: input },
        { type: 'assistant', content: response.data.message }
      ];
      
      setMessages(newMessages);
      
      // Update conversation history
      await fetchConversationHistory();
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  const handleFlightSearch = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/flights', flightDetails);
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
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about travel plans, itineraries, or flight bookings..."
              className="flex-1 p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
            <button
              onClick={handleSendMessage}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
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