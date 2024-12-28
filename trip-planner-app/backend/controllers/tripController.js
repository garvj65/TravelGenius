import { supabase } from "../server.js";

export const tripController = {
  // Create a new trip
  async createTrip(req, res) {
    try {
      const { user_id, title, description, duration, highlights, image_url } = req.body;
      
      const { data, error } = await supabase
        .from('trips')
        .insert([
          { 
            user_id,
            title,
            description,
            duration,
            highlights,
            image_url,
            created_at: new Date()
          }
        ])
        .select();

      if (error) throw error;
      res.status(201).json(data[0]);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get all trips for a user
  async getUserTrips(req, res) {
    try {
      const { user_id } = req.params;
      
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get a specific trip
  async getTrip(req, res) {
    try {
      const { id } = req.params;
      
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'Trip not found' });
      }
      
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Update a trip
  async updateTrip(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const { data, error } = await supabase
        .from('trips')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      res.status(200).json(data[0]);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete a trip
  async deleteTrip(req, res) {
    try {
      const { id } = req.params;
      
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

