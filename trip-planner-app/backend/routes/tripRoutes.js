import express from "express";
import { tripController } from "../controllers/tripController.js";

const router = express.Router()

router.post('/trips', tripController.createTrip)
router.get('/trips/:id', tripController.getTrip)
// Add more routes as needed

export default router
