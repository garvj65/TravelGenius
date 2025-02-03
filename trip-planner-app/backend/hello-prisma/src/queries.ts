import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

// A `main` function so that we can use async/await
async function main() {
  // Seed the database with a user, trip, activities, and conversations
  const userId = "user123"; // Example Clerk user ID
  const tripId = "trip123"; // Example trip ID

  // Create a new trip
  const newTrip = await prisma.trip.create({
    data: {
      id: tripId,
      userId: userId,
      title: "Summer Vacation",
      description: "A relaxing trip to Paris",
      destination: "Paris",
      startDate: new Date("2023-07-01"),
      endDate: new Date("2023-07-10"),
      budget: 2000.0,
      status: "planning",
      activities: {
        create: [
          {
            day: 1,
            title: "Visit Eiffel Tower",
            description: "Explore the iconic landmark",
            location: "Eiffel Tower, Paris",
            startTime: new Date("2023-07-01T10:00:00Z"),
            duration: 120,
            cost: 50.0,
          },
          {
            day: 1,
            title: "Lunch at a French Bistro",
            description: "Enjoy traditional French cuisine",
            location: "Le Petit Bistro, Paris",
            startTime: new Date("2023-07-01T13:00:00Z"),
            duration: 90,
            cost: 80.0,
          },
        ],
      },
      conversations: {
        create: [
          {
            userId: userId,
            prompt: "What are some must-visit places in Paris?",
            response: "You should visit the Eiffel Tower, Louvre Museum, and Notre-Dame Cathedral.",
            tripContext: "Planning a 10-day trip to Paris",
          },
        ],
      },
    },
    include: {
      activities: true,
      conversations: true,
    },
  });
  console.log(`Created a new trip: ${JSON.stringify(newTrip)}`);

  // Retrieve all trips for a specific user
  const userTrips = await prisma.trip.findMany({
    where: {
      userId: userId,
    },
    include: {
      activities: true,
      conversations: true,
    },
  });
  console.log(`Retrieved all trips for user ${userId}: ${JSON.stringify(userTrips)}`);

  // Update a trip's status
  const updatedTrip = await prisma.trip.update({
    where: { id: tripId },
    data: { status: "active" },
  });
  console.log(`Updated trip status: ${JSON.stringify(updatedTrip)}`);

  // Add a new activity to an existing trip
  const newActivity = await prisma.activity.create({
    data: {
      tripId: tripId,
      day: 2,
      title: "Visit Louvre Museum",
      description: "Explore world-famous art collections",
      location: "Louvre Museum, Paris",
      startTime: new Date("2023-07-02T09:00:00Z"),
      duration: 180,
      cost: 70.0,
    },
  });
  console.log(`Added a new activity: ${JSON.stringify(newActivity)}`);

  // Add a new conversation to an existing trip
  const newConversation = await prisma.conversation.create({
    data: {
      userId: userId,
      tripId: tripId,
      prompt: "What are some good restaurants in Paris?",
      response: "You can try Le Comptoir du Relais, L'Ambroisie, and Le Chateaubriand.",
      tripContext: "Looking for dining options in Paris",
    },
  });
  console.log(`Added a new conversation: ${JSON.stringify(newConversation)}`);

  // Query trips with filters (e.g., trips in planning status)
  const planningTrips = await prisma.trip.findMany({
    where: {
      userId: userId,
      status: "planning",
      startDate: {
        gte: new Date(), // Trips starting today or later
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  console.log(`Retrieved planning trips: ${JSON.stringify(planningTrips)}`);

  // Create or update user preferences
  const userPreferences = await prisma.userPreference.upsert({
    where: { userId: userId },
    update: {
      preferredCurrency: "EUR",
      travelStyle: ["luxury", "cultural"],
      dietaryRestrictions: ["vegetarian"],
    },
    create: {
      userId: userId,
      preferredCurrency: "EUR",
      preferredLanguage: "en",
      travelStyle: ["luxury", "cultural"],
      dietaryRestrictions: ["vegetarian"],
    },
  });
  console.log(`Updated user preferences: ${JSON.stringify(userPreferences)}`);

  // Delete a trip (and its related activities and conversations due to cascading)
  await prisma.trip.delete({
    where: { id: tripId },
  });
  console.log(`Deleted trip with ID ${tripId}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });