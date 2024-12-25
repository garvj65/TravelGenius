import { Trip } from "../models/trip.js";

export const tripController = {
  async createTrip(req, res) {
    try {
      const tripData = req.body;
      const trip = await Trip.create(tripData);
      res.status(201).json(trip);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getTrip(req, res) {
    try {
      const { id } = req.params;
      const trip = await Trip.getById(id);
      res.status(200).json(trip);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },
};

