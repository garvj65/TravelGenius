import express from "express";
import { tripController } from "../controllers/tripController.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router()

router.use(authenticateUser); // Protect all trip routes

router.post('/', tripController.createTrip)
router.get('/user/:user_id', tripController.getUserTrips)
router.get('/:id', tripController.getTrip)
router.put('/:id', tripController.updateTrip)
router.delete('/:id', tripController.deleteTrip)
// Add more routes as needed

export default router
