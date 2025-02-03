import dotenv from "dotenv";
import { createClerkClient } from "@clerk/clerk-sdk-node";
import { WebSocketServer } from "ws";

dotenv.config();

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export function initializeWebSocket(server) {
  const wss = new WebSocketServer({ server });

  const clients = new Map(); // Store client connections with their userIds

  wss.on('connection', async (ws, req) => {
    try {
      // Get token from URL params
      const url = new URL(req.url, 'http://localhost');
      const token = url.searchParams.get('token');

      if (!token) {
        ws.close(1008, 'No token provided');
        return;
      }

      // Verify token with Clerk
      const { userId } = await clerk.sessions.verifySession(token);
      clients.set(userId, ws);

      ws.on('close', () => {
        clients.delete(userId);
      });

    } catch (error) {
      console.error('WebSocket connection error:', error);
      ws.close(1008, 'Authentication failed');
    }
  });

  return {
    notifyUser: (userId, data) => {
      const client = clients.get(userId);
      if (client) {
        client.send(JSON.stringify(data));
      }
    }
  };
} 