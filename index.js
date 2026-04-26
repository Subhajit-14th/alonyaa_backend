import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";

// .env file theke data (jemon MONGO_URI) load korar jonno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// JSON data receive korar middleware
app.use(express.json());

// ==========================================
// 1. MongoDB Database Connection
// ==========================================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Database connected successfully!"))
  .catch((error) => console.log("❌ MongoDB connection failed:", error));

// ==========================================
// 3. API Routes
// ==========================================
app.use("/api", productRoutes);

// Basic testing route
app.get("/", (req, res) => {
  res.send("Alonyaa Backend API is running successfully!");
});

// ==========================================
// 4. Server Start Kora
// ==========================================
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
