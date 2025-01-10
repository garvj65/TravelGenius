import express from "express";
import { chatController } from "../controllers/chatController.js";

const router = express.Router();

router.post('/generate-trip', chatController.generateTripSuggestion);

export default router;
