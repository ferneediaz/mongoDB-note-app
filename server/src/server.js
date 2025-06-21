import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json()); // this middleware is used to parse the request body

// Apply rate limiter BEFORE routes
app.use(rateLimiter);

// Apply routes (remove the duplicate)
app.use("/api/notes", notesRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("server is running on port ", PORT);
  });
});
