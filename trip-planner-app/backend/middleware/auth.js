import { createClerkClient } from "@clerk/clerk-sdk-node";

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
});

export const authenticateUser = async (req, res, next) => {
  try {
    const sessionToken = req.headers.authorization?.split(' ')[1];
    
    if (!sessionToken) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const session = await clerk.sessions.verifySession(sessionToken);
    req.user = session;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}; 