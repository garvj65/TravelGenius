import express from "express";
import { tripController } from "../controllers/tripController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router()

router.post('/', authenticate, tripController.createTrip)
router.get('/', authenticate, tripController.getUserTrips)
router.get('/:tripId', authenticate, tripController.getTrip)
router.post('/:tripId/generate-itinerary', authenticate, tripController.generateItinerary)
router.put('/:id', tripController.updateTrip)
router.delete('/:id', tripController.deleteTrip)
// Add more routes as needed

export default router
