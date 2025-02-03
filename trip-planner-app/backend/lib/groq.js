import axios from "axios";

const GROQ_API_KEY = process.env.GROQ_API_KEY; // Set this in your .env file

if (!GROQ_API_KEY) {
  console.error("GROQ_API_KEY is not set. Please check your .env file.");
  process.exit(1);
}

const groqClient = axios.create({
  baseURL: 'https://your-groq-api-endpoint.com', // Replace with your actual GROQ API endpoint
  headers: {
    'Authorization': `Bearer ${GROQ_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export { groqClient }; 