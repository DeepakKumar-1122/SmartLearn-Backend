// import express from 'express';
// import mongoose from "mongoose";

// const app = express();

// app.use(express.json());

// import learningPathRoutes from './routes/learningPathRoutes.js';

// app.use("/api/learning-path", learningPathRoutes);


// // Connet to MongoDB
// const PORT = process.env.PORT || 5000;
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`App listening on port ${PORT}!`);
//     });
//   })
//   .catch((e) => {
//     console.log(e);
//   });


import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
// import courseRoutes from "./routes/course.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
// app.use("/api/courses", courseRoutes);

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
