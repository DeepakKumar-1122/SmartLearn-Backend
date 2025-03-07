import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { generateLearningPath } from "../controllers/course.controller.js";

const router = express.Router();

router.post("/generate", authMiddleware, generateLearningPath);

export default router;
