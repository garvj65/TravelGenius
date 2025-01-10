import cors from "cors";
import dotenv from "dotenv";
import express, { json } from "express";
import { generateTripSuggestion } from "./controllers/chatController.js";

// Import dependencies

// Load environment variables
dotenv.config();
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("Error: OPENAI_API_KEY is not defined in the environment variables.");
  process.exit(1); // Exit the process if the API key is missing
}

const app = express();

// Middleware setup
app.use(cors());
app.use(json());

// Define routes
app.post("/api/generate-trip", generateTripSuggestion);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Travel Planner API" });
});

app.get("/test-supabase", async (req, res) => {
  try {
    // Example Supabase query
    const { data: tables, error: tablesError } = await from("_tables").select("*");
    if (tablesError) throw tablesError;

    const { data, error } = await from("users").select("*"); // Replace "users" with your actual table name
    if (error) throw error;

    res.json({
      message: "Query successful",
      tables: tables, // List available tables
      rowCount: data.length,
      data: data, // Query result
    });
  } catch (error) {
    console.error("Error during Supabase query:", error);
    res.status(500).json({ error: error.message });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ error: "Something went wrong. Please try again later." });
});

// Start the server
const PORT = process.env.PORT || 5000; // Default to port 5000 if not specified
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
