import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import notesRoutes from "./routes/notesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // Adjust according to your frontend's address
  })
);
app.use(rateLimiter);
app.use(express.json());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

//connect to database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
