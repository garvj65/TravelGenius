import OpenAI from "openai";
import { config } from "../config/config.js";

const openai = new OpenAI({
  apiKey: config.openaiApiKey
});

export const chatController = {
  async generateTripSuggestion(req, res) {
    try {
      const { message } = req.body;

      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are Sinbad, an AI travel companion helping users plan their perfect trip. Provide detailed, personalized travel suggestions based on user preferences."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const suggestion = completion.choices[0].message.content;
      res.json({ suggestion });
      
    } catch (error) {
      console.error('OpenAI API Error:', error);
      res.status(500).json({ error: error.message });
    }
  }
};