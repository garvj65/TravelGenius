import OpenAI from "openai";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Initialize OpenAI client with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a knowledgeable travel assistant. Help users plan their trips by providing:
- Detailed daily itineraries
- Local recommendations
- Estimated costs and durations
- Cultural insights and tips
Format responses in a clear, structured way.`;

export const chatController = {
  async generateTripPlan(req, res) {
    try {
      const { prompt, tripContext } = req.body;
      const userId = req.auth.userId; // From Clerk

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Trip Context: ${tripContext}\nUser Query: ${prompt}` }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const suggestion = completion.choices[0].message.content;

      // Store conversation in database
      await prisma.conversation.create({
        data: {
          userId,
          prompt,
          response: suggestion,
          tripContext
        }
      });

      res.json({ suggestion });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to generate trip plan' });
    }
  },

  async getTripSuggestions(req, res) {
    try {
      const userId = req.auth.userId;
      const conversations = await prisma.conversation.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
      
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch suggestions' });
    }
  }
};
