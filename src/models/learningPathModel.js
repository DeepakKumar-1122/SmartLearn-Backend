import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  resourceType: { type: String, required: true },
  resourceLink: { type: String, required: true },
});

const topicSchema = new mongoose.Schema({
  topicName: { type: String, required: true },
  timeRecommended: { type: String, required: true },
  resources: [resourceSchema],
});

const learningPathSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  difficultyLevel: { type: String, required: true },
  topics: [topicSchema],
});

const LearningPath = mongoose.model("LearningPath", learningPathSchema);

export default LearningPath;
