import { GoogleGenerativeAI } from "@google/generative-ai";
import Course from "../models/course.model.js";
import preprocessData from "../utils/dataPreprocessing.js";
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateLearningPath = async (req, res) => {
  try {
    const reqBody = await preprocessData(req.body);
        
    const { courseName, difficultyLevel, schedulingFrequency, timeCommitment, learningGoals, preferredResources } = reqBody;
    const userId = req.user.userId;
        
    const prompt = `
      Generate a personalized learning path for the course "${courseName}" at the "${difficultyLevel}" level. 
      The user prefers to study "${schedulingFrequency}" with a time commitment of "${timeCommitment}" hours. 
      ${learningGoals.length!==0 ? `Learning goals: ${learningGoals}.` : ""}
      ${preferredResources.length!==0 ? `Preferred resources: ${preferredResources}.` : ""}
      
      Please structure the response as a JSON object with the following format with no extra text for easy parsing:
      {
        "courseName": "<course name>",
        "difficultyLevel": "<difficulty level>",
        "topics": [
          {
            "topicName": "<name of the topic>",
            "timeRecommended": "<time recommended for this topic, in hours, should be a number with no additional text>",
            "resources": [
              {
                "resourceType": "<type of resource, e.g., Video, Article, Interactive Tutorial>",
                "resourceLink": "<URL or link to the resource>"
              }
            ]
          }
        ]
      }
    `;

    // console.log(prompt);
    
    const result = await model.generateContent(prompt);

    let cleanedResponse = result.response
      .text()
      .replace(/```json\n|\n```/g, "")
      .trim();

    const generatedData = JSON.parse(cleanedResponse);

    const newCourse = new Course({
      userId,
      courseName,
      difficultyLevel,
      schedulingFrequency,
      timeCommitment,
      topics: generatedData.topics.map((topic, index) => ({
        order: index + 1,
        topicName: topic.topicName,
        timeRecommended: topic.timeRecommended,
        resources: topic.resources,
      })),
      completionPercentage: 0,
      timeSpent: 0,
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error generating course:", error);
    res.status(500).json({ message: "Failed to generate learning path", error:error.message });
  }
};
