import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { generateLearningPath, getAllCourses } from "../controllers/course.controller.js";

const router = express.Router();

router.post("/generate", authMiddleware, generateLearningPath);
router.get("/", authMiddleware, getAllCourses);

export default router;
