import { useAuth } from "@clerk/clerk-react";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";

export function ConversationHistory() {
  const { getToken } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadConversations = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await fetch('http://localhost:5000/api/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Conversation History</h2>
      <div className="space-y-4">
        {conversations.map((conv) => (
          <div key={conv.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-500">
                {format(new Date(conv.createdAt), 'PPpp')}
              </p>
              {conv.tripContext && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  Trip Related
                </span>
              )}
            </div>
            <div className="space-y-2">
              <div className="bg-blue-50 p-3 rounded">
                <p className="font-medium text-sm">You:</p>
                <p className="text-gray-700">{conv.prompt}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="font-medium text-sm">Assistant:</p>
                <p className="text-gray-700 whitespace-pre-wrap">{conv.response}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 