import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { connectDB } from "./db";
import authRoutes from "./routes/auth";
import problemRoutes from "./routes/problems";
import cheatSheetRoutes from "./routes/cheatSheet";


const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);       // signup, login, update, delete user
app.use("/api/problems", problemRoutes); // user-specific problems (JWT protected inside)
app.use("/api/cheatsheets", cheatSheetRoutes); // user-specific cheetsheets (JWT protected inside)

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
