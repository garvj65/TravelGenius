import { supabase } from "../config/database.js";

export class Trip {
  static async create(tripData) {
    const { data, error } = await supabase
      .from('trips')
      .insert([tripData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getById(id) {
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        trip_days (*),
        hotels (*),
        trip_media (*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  // Add more methods as needed
}
