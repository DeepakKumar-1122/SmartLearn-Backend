import LearningPath from "../models/learningPathModel.js";
async function saveLearningPathToDB(learningPathJSON) {
  try {
    
    const newLearningPath = new LearningPath({
      courseName: learningPathJSON.courseName,
      difficultyLevel: learningPathJSON.difficultyLevel,
      topics: learningPathJSON.topics.map((topic) => ({
        topicName: topic.topicName,
        timeRecommended: topic.timeRecommended,
        resources: topic.resources.map((resource) => ({
          resourceType: resource.resourceType,
          resourceLink: resource.resourceLink,
        })),
      })),
    });

    
    const savedLearningPath = await newLearningPath.save();
    console.log("Learning Path saved successfully:", savedLearningPath);
    return savedLearningPath;
  } catch (error) {
    console.error("Error saving learning path to database:", error);
    throw error;
  }
}

export default saveLearningPathToDB;