import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

export function ChatInterface({ tripId }) {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);

  const connectWebSocket = useCallback(async () => {
    const token = await getToken();
    const ws = new WebSocket(`ws://localhost:5000?token=${token}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_message') {
        setMessages(prev => [...prev, {
          type: 'user',
          content: data.data.prompt,
          response: data.data.response,
          timestamp: new Date(data.data.createdAt)
        }]);
      }
    };

    ws.onclose = () => {
      // Attempt to reconnect after 5 seconds
      setTimeout(connectWebSocket, 5000);
    };

    wsRef.current = ws;
  }, [getToken]);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setLoading(true);

    try {
      const token = await getToken();
      const response = await fetch('http://localhost:5000/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tripId,
          message: userMessage
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, {
        type: 'user',
        content: data.prompt,
        response: data.response,
        timestamp: new Date(data.createdAt)
      }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-lg py-2 px-4 max-w-[80%]">
                <p className="text-sm text-gray-900">{msg.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {msg.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="flex items-start justify-end">
              <div className="bg-gray-100 rounded-lg py-2 px-4 max-w-[80%]">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {msg.response}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your trip..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatInterface;