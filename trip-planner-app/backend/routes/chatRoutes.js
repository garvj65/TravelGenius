import express from "express";
import { chatController } from "../controllers/chatController.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateUser);
router.post('/generate-trip', chatController.generateTripSuggestion);

export default router; 