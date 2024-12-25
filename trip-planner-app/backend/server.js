import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import tripRoutes from "./routes/tripRoutes.js";

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// Routes
app.use('/api', tripRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
