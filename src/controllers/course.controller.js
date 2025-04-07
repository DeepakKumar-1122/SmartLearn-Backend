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
      ${preferredResources.length!==0 ? `Preferred resources: ${preferredResources}.` : "Preferred resources: Choose any type of learning resources suitable for this course."}
      
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

    console.log(prompt);
    
    const result = await model.generateContent(prompt);

    let cleanedResponse = result.response
      .text()
      .replace(/```json\n|\n```/g, "")
      .trim();

    console.log(cleanedResponse);    
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


export const getAllCourses = async (req, res) => {
  try {
    const userId = req.user.userId;

    const courses = await Course.find({ userId: userId });

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses. Please try again later.",
    });
  }
};

export const updateTimeSpent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { timeSpent } = req.body;
    const userId = req.user.userId;

    if (typeof timeSpent !== "number" || timeSpent <= 0) {
      return res.status(400).json({
        success: false,
        message: "Time spent must be a positive number.",
      });
    }

    const course = await Course.findOne({ _id: courseId, userId: userId });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or access denied.",
      });
    }

    course.progress.timeSpent += timeSpent;

    // const totalTopics = course.topics.length;
    // const completedTopics = course.progress.completedTopics.length;
    // course.progress.completionPercentage = ((completedTopics / totalTopics) * 100).toFixed(2);

    await course.save();

    res.status(200).json({
      success: true,
      message: "Time spent updated successfully."
    });
  } catch (error) {
    console.error("Error updating time spent:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update time spent. Please try again later.",
    });
  }
}

export const updateCompletionPercentage = async (req, res) => {
  try {
    const { courseId, topicId, resourceIndex } = req.body;
    const userId = req.user.userId;

    // Find the course and ensure it belongs to the user
    const course = await Course.findOne({ _id: courseId, userId: userId });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or access denied.",
      });
    }

    // Find the topic inside the course
    const topic = course.topics.id(topicId);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found.",
      });
    }

    // Mark resource as completed (assuming `resources` is an array of objects)
    if (!topic.resources[resourceIndex]) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource index.",
      });
    }

    topic.resources[resourceIndex].completed = true;

    // Check if all resources in the topic are completed
    const allResourcesCompleted = topic.resources.every((res) => res.completed);

    // If all resources are completed, mark the topic as completed
    if (allResourcesCompleted && !course.progress.completedTopics.includes(topicId)) {
      course.progress.completedTopics.push(topicId);
    }

    // Compute completion percentage
    const totalTopics = course.topics.length;
    const completedTopics = course.progress.completedTopics.length;
    course.progress.completionPercentage = ((completedTopics / totalTopics) * 100).toFixed(2);

    await course.save();

    res.status(200).json({
      success: true,
      message: "Completion percentage updated successfully.",
      completionPercentage: course.progress.completionPercentage,
    });
  } catch (error) {
    console.error("Error updating completion percentage:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update completion percentage. Please try again later.",
    });
  }
};


export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId; // Extracted from authMiddleware

    // Find the course by ID and userId to ensure ownership
    const course = await Course.findOne({ _id: courseId, userId });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or access denied.",
      });
    }

    // Delete the course
    await Course.deleteOne({ _id: courseId });

    res.status(200).json({
      success: true,
      message: "Course deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete course. Please try again later.",
    });
  }
};

export const getCourseRecommendations = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user's previous courses
    const userCourses = await Course.find({ userId }).select("courseName difficultyLevel");

    if (userCourses.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No previous courses found to generate recommendations.",
        recommendations: [],
      });
    }

    // Extract course names and difficulty levels
    const courseNames = userCourses.map((course) => course.courseName);
    const difficulties = userCourses.map((course) => course.difficultyLevel);

    // Escape special characters in course names for regex
    const escapeRegex = (text) => text.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

    const regexPatterns = courseNames.map((name) => new RegExp(escapeRegex(name), "i"));

    // Determine the next difficulty level (suggest harder courses)
    const difficultyLevels = ["beginner", "intermediate", "advanced"];
    const maxUserDifficulty = Math.max(...difficulties.map((d) => difficultyLevels.indexOf(d)));

    // Fetch courses that match the name patterns and are of higher difficulty
    const recommendedCourses = await Course.find({
      courseName: { $in: regexPatterns }, // Match similar names
      difficultyLevel: { $in: difficultyLevels.slice(maxUserDifficulty + 1) }, // Get harder courses
    }).select("courseName difficultyLevel");

    return res.status(200).json({
      success: true,
      recommendations: recommendedCourses,
    });
  } catch (error) {
    console.error("Error fetching course recommendations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate recommendations. Please try again later.",
    });
  }
};