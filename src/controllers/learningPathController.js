import { generatePath } from "./pathGenerator.js";
import saveLearningPathToDB from "../db/saveLearningPath.js";

async function generateAndSaveLearningPath(req, res) {
  try {
    // Generate the learning path
    const learningPathJSON = await generatePath(req, res);

    // Save the generated learning path to the database
    const savedLearningPath = await saveLearningPathToDB(learningPathJSON);

    // Respond with the saved learning path
    res.status(201).json(savedLearningPath);
  } catch (error) {
    console.error("Error in generating or saving learning path:", error);
    res.status(500).json({ error: "Failed to generate and save learning path" });
  }
}

export { generateAndSaveLearningPath };
