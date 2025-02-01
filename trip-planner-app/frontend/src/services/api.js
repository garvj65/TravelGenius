import axios from "axios";

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/signin', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  async register(email, password) {
    const response = await api.post('/auth/signup', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
  }
};

export const tripService = {
  async createTrip(tripData) {
    const response = await api.post('/trips', tripData);
    return response.data;
  },

  async getUserTrips() {
    const response = await api.get('/trips/user');
    return response.data;
  },

  async getTrip(id) {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },

  async searchTrips(query) {
    const response = await api.get(`/trips/search?q=${query}`);
    return response.data;
  }
}; 