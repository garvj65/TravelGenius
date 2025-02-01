import  get  from "axios";
import OpenAI from "openai";
import cors from "cors";
import express, { json } from "express";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

// backend/server.js

config();

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const app = express();
app.use(cors());
app.use(json());

// System prompt for travel assistant
const SYSTEM_PROMPT = `You are a knowledgeable travel assistant. Help users plan their trips by providing detailed itineraries, 
recommendations, and handling flight bookings. Be specific with time slots, places to visit, and practical travel advice. 
When suggesting activities, include estimated times and costs when possible.`;

// Add authentication middleware
const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) throw error;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Protected routes
app.use('/api/itinerary', authenticateUser);
app.use('/api/conversations', authenticateUser);
app.use('/api/flights', authenticateUser);

class TravelAPI {
    async generateItinerary(userInput, conversationHistory = []) {
        try {
            const messages = [
                { role: 'system', content: SYSTEM_PROMPT },
                ...conversationHistory,
                { role: 'user', content: userInput }
            ];

            const response = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: messages,
                temperature: 0.7,
                max_tokens: 500
            });

            // Store conversation in Supabase
            await this.saveConversation(userInput, response.data.choices[0].message.content);

            return {
                message: response.data.choices[0].message.content,
                conversation_id: Date.now() // You might want to generate this differently
            };
        } catch (error) {
            console.error('Error generating itinerary:', error);
            throw error;
        }
    }

    async saveConversation(userMessage, aiResponse) {
        try {
            const { data, error } = await supabase
                .from('conversations')
                .insert([
                    {
                        user_message: userMessage,
                        ai_response: aiResponse,
                        timestamp: new Date().toISOString()
                    }
                ]);

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error saving to Supabase:', error);
            throw error;
        }
    }

    async getConversationHistory() {
        try {
            const { data, error } = await supabase
                .from('conversations')
                .select('*')
                .order('timestamp', { ascending: false })
                .limit(10);

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching conversation history:', error);
            throw error;
        }
    }

    async searchFlights(origin, destination, date) {
        // Keep existing flight search logic
        // Add flight search results to Supabase
        try {
            const response = await get(
                `https://test.api.amadeus.com/v2/shopping/flight-offers`,
                {
                    headers: { Authorization: `Bearer ${process.env.AMADEUS_TOKEN}` },
                    params: {
                        originLocationCode: origin,
                        destinationLocationCode: destination,
                        departureDate: date,
                        adults: 1
                    }
                }
            );

            // Store flight search results
            await supabase
                .from('flight_searches')
                .insert([
                    {
                        origin,
                        destination,
                        date,
                        results: response.data,
                        timestamp: new Date().toISOString()
                    }
                ]);

            return response.data;
        } catch (error) {
            console.error('Error searching flights:', error);
            throw error;
        }
    }
}

const travelAPI = new TravelAPI();

// API Endpoints
app.post('/api/itinerary', async (req, res) => {
    try {
        const response = await travelAPI.generateItinerary(req.body.prompt, req.body.conversationHistory);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate itinerary' });
    }
});

app.get('/api/conversations', async (req, res) => {
    try {
        const history = await travelAPI.getConversationHistory();
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch conversation history' });
    }
});

app.post('/api/flights', async (req, res) => {
    try {
        const { origin, destination, date } = req.body;
        const response = await travelAPI.searchFlights(origin, destination, date);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search flights' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});