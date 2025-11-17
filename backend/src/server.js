import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import notesRoutes from "./routes/notesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: "http://localhost:5173", // Adjust according to your frontend's address
    })
  );
}
app.use(rateLimiter);
app.use(express.json());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

// Serve static files from the React frontend app
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
}
//connect to database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
