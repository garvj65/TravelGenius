import { OpenAI } from "openai";
import { supabase } from "../server.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const chatController = {
  async generateTripSuggestion(req, res) {
    try {
      const { prompt, user_id } = req.body;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful travel planner assistant. Generate detailed trip suggestions based on user input."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const suggestion = completion.choices[0].message.content;

      // Store the conversation in Supabase
      const { error } = await supabase
        .from('chat_history')
        .insert([
          {
            user_id,
            prompt,
            response: suggestion,
            created_at: new Date()
          }
        ]);

      if (error) throw error;

      res.json({ suggestion });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}; 