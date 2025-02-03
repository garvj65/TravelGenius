import  openai  from "../lib/openai.js";
import prisma from "../lib/prisma.js";

export const tripController = {
  // Create a new trip
  async createTrip(req, res) {
    try {
      const { title, description, destination, startDate, endDate, budget } = req.body;
      const userId = req.auth.userId; // From Clerk

      const trip = await prisma.trip.create({
        data: {
          userId,
          title,
          description,
          destination,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          budget: budget ? parseFloat(budget) : null,
          status: 'planning'
        },
      });

      res.status(201).json(trip);
    } catch (error) {
      console.error('Error creating trip:', error);
      res.status(500).json({ error: 'Failed to create trip' });
    }
  },

  // Get user's trips
  async getUserTrips(req, res) {
    try {
      const userId = req.auth.userId;

      const trips = await prisma.trip.findMany({
        where: { userId },
        include: {
          activities: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json(trips);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch trips' });
    }
  },

  // Get single trip
  async getTrip(req, res) {
    try {
      const { id } = req.params;
      const userId = req.auth.userId;

      const trip = await prisma.trip.findFirst({
        where: { 
          id,
          userId 
        },
        include: {
          activities: true,
          conversations: true,
        },
      });

      if (!trip) {
        return res.status(404).json({ error: 'Trip not found' });
      }

      res.json(trip);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch trip' });
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
  },

  async generateItinerary(req, res) {
    try {
      const { tripId } = req.params;
      const trip = await prisma.trip.findUnique({
        where: { id: tripId }
      });

      const prompt = `Create a detailed daily itinerary for a trip to ${trip.destination} 
        from ${trip.startDate} to ${trip.endDate}. Budget: ${trip.budget}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a travel planner." },
          { role: "user", content: prompt }
        ]
      });

      const itinerary = completion.choices[0].message.content;

      // Store the conversation
      await prisma.conversation.create({
        data: {
          userId: trip.userId,
          tripId,
          prompt,
          response: itinerary,
          tripContext: `Generating itinerary for ${trip.destination}`
        }
      });

      res.json({ itinerary });
    } catch (error) {
      console.error('Error generating itinerary:', error);
      res.status(500).json({ error: 'Failed to generate itinerary' });
    }
  }
};

