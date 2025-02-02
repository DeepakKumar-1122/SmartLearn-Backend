import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import preprocessData from "../utils/dataPreprocessing.js";
dotenv.config();

const API_KEY = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function generatePath(req, res) {
  try {

    // Preprocessing the data and destructuring data for prompt generation
    const preprocessedData = await preprocessData(req.body);
    const {
      course,
      difficulty,
      schedulingFrequency,
      timeCommitment,
      learningGoals,
      preferredResources,
    } = preprocessedData;

    const learningGoalsPart = learningGoals.length
      ? `Focus on "${learningGoals.join(", ")}",`
      : "";
    const preferredResourcesPart = preferredResources.length
      ? `and prioritize learning materials in the form of "${preferredResources.join(", ")}".`
      : "and provide learning materials in any suitable format.";

    console.log(req.body);
    
    const prompt = `
      Generate a personalized learning path for the course "${course}" at the "${difficulty}" level. 
      The user prefers to study "${schedulingFrequency}" with a time commitment of "${timeCommitment}" hours per day. 
      ${learningGoalsPart} ${preferredResourcesPart}
      Please structure the response as a JSON object with the following format:
      {
        "courseName": "<course name>",
        "difficultyLevel": "<difficulty level>",
        "topics": [
          {
            "topicName": "<name of the topic>",
            "timeRecommended": "<time recommended for this topic>",
            "resources": [
              {
                "resourceType": "<type of resource, e.g., Video, Article, Interactive Tutorial>",
                "resourceLink": "<URL or link to the resource>"
              }
            ]
          }
        ]
      }
      Ensure the response is strictly in this JSON format with no additional text.
    `;

    const result = await model.generateContent(prompt);

    let cleanedResponse = result.response
      .text()
      .replace(/```json\n|\n```/g, "")
      .trim();

    try {
      const learningPathJSON = JSON.parse(cleanedResponse);
      console.log(learningPathJSON);

      return learningPathJSON;
    } catch (error) {
      console.error("Error parsing JSON response:", error);

      if (!res.headersSent) {
        return res
          .status(500)
          .json({ error: "Failed to parse response as JSON" });
      }
    }
  } catch (error) {
    console.error("Error generating learning path:", error);
    res.status(500).json({ error: "Failed to generate learning path" });
  }
}

export { generatePath };