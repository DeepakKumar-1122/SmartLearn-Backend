import express from 'express';
const router = express.Router();

import { generateAndSaveLearningPath } from '../controllers/learningPathController.js';

router.post("/generate", generateAndSaveLearningPath);

export default router;