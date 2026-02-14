import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import blogRoutes from "./routes/blogRoutes";
import projectRoutes from "./routes/projectRoutes";
import skillRoutes from "./routes/skillRoutes";
import educationRoutes from "./routes/educationRoutes";
import experienceRoutes from "./routes/experienceRoutes";
import tagRoutes from "./routes/tagRoutes";
import certificationRoutes from "./routes/certificationRoutes";
import reviewRoutes from "./routes/reviewRoutes";

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

//Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/certifications", certificationRoutes);
app.use("/api/reviews", reviewRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📚 API available at http://localhost:${PORT}/health`);
});
