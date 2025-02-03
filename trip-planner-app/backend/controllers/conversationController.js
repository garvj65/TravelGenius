import prisma from "../lib/prisma.js";
import { groqClient } from "../lib/groq.js";
import { websocket } from "../server.js";

const SYSTEM_PROMPT = `You are a knowledgeable travel assistant. Help users plan their trips by providing:
- Detailed daily itineraries
- Local recommendations
- Estimated costs and durations
- Cultural insights and tips
Format responses in a clear, structured way.`;

export const conversationController = {
  async createMessage(req, res) {
    try {
      const { tripId, message } = req.body;
      const userId = req.auth.userId;

      // Prepare the request to GROQ API
      const response = await groqClient.post('/generate-response', {
        prompt: message,
        tripId: tripId,
      });

      const aiResponse = response.data.response; // Adjust based on GROQ API response structure

      // Store conversation in database
      const conversation = await prisma.conversation.create({
        data: {
          userId,
          tripId,
          prompt: message,
          response: aiResponse,
        }
      });

      // Notify connected clients about new message
      websocket.notifyUser(userId, {
        type: 'new_message',
        data: conversation
      });

      res.json(conversation);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to process message' });
    }
  },

  async getConversationHistory(req, res) {
    try {
      const userId = req.auth.userId;
      const { tripId } = req.query;

      const conversations = await prisma.conversation.findMany({
        where: {
          userId,
          ...(tripId && { tripId })
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch conversations' });
    }
  }
}; 