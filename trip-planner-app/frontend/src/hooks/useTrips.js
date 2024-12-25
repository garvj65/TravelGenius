import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export function useTrips(userId) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Cache key based on user ID
  const cacheKey = `trips_${userId}`;
  
  useEffect(() => {
    const fetchAndCacheTrips = async () => {
      // Check cache first
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setTrips(JSON.parse(cached));
        setLoading(false);
      }
      
      // Fetch fresh data
      try {
        const { data, error } = await supabase
          .from('trips')
          .select('*')
          .eq('user_id', userId);
          
        if (error) throw error;
        
        setTrips(data);
        // Update cache
        localStorage.setItem(cacheKey, JSON.stringify(data));
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndCacheTrips();
  }, [userId, cacheKey]);

  return { trips, loading };
} 