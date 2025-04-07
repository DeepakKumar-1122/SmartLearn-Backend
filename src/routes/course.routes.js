import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  deleteCourse,
  generateLearningPath,
  getAllCourses,
  updateCompletionPercentage,
  updateTimeSpent,
  getCourseRecommendations,
} from "../controllers/course.controller.js";

const router = express.Router();

router.post("/generate", authMiddleware, generateLearningPath);
router.get("/", authMiddleware, getAllCourses);
router.get("/recommend", authMiddleware, getCourseRecommendations);
router.delete("/:courseId", authMiddleware, deleteCourse);
router.put("/:courseId/timespent", authMiddleware, updateTimeSpent);
router.put("/:courseId/completion", authMiddleware, updateCompletionPercentage);

export default router;
