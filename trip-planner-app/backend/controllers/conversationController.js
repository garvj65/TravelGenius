import  openai  from "../lib/openai.js";
import prisma from "../lib/prisma.js";
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

      // Get trip context if tripId is provided
      let tripContext = '';
      if (tripId) {
        const trip = await prisma.trip.findUnique({
          where: { id: tripId }
        });
        tripContext = `Trip to ${trip.destination} from ${trip.startDate} to ${trip.endDate}. Budget: $${trip.budget}`;
      }

      // Generate AI response
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Context: ${tripContext}\nQuestion: ${message}` }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const aiResponse = completion.choices[0].message.content;

      // Store conversation in database
      const conversation = await prisma.conversation.create({
        data: {
          userId,
          tripId,
          prompt: message,
          response: aiResponse,
          tripContext
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