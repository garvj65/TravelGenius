import axios from "axios";

const API_URL = 'http://localhost:5000/api';

export const tripService = {
  async generateItinerary(prompt, conversationHistory = []) {
    const response = await axios.post(`${API_URL}/itinerary`, {
      prompt,
      conversationHistory
    });
    return response.data;
  },

  async getConversations() {
    const response = await axios.get(`${API_URL}/conversations`);
    return response.data;
  },

  async searchFlights(origin, destination, date) {
    const response = await axios.post(`${API_URL}/flights`, {
      origin,
      destination,
      date
    });
    return response.data;
  }
}; 