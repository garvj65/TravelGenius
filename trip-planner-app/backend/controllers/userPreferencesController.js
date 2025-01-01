import { supabase } from "../server.js";

export const userPreferencesController = {
  async updatePreferences(req, res) {
    try {
      const { user_id } = req.params;
      const preferences = req.body;

      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id,
          ...preferences,
          updated_at: new Date()
        })
        .select();

      if (error) throw error;
      res.json(data[0]);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getPreferences(req, res) {
    try {
      const { user_id } = req.params;

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user_id)
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}; 