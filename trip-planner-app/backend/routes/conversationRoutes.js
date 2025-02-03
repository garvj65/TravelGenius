import express from "express";
import { conversationController } from "../controllers/conversationController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post('/', authenticate, conversationController.createMessage);
router.get('/', authenticate, conversationController.getConversationHistory);

export default router; 