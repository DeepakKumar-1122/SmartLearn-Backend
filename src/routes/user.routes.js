import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import { getUserProfile, updateUserProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", verifyToken, getUserProfile);
router.put("/", verifyToken, updateUserProfile);

export default router;
