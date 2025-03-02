import mongoose from 'mongoose';

// Define Course Schema
const CourseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseName: { type: String, required: true },
  difficultyLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  schedulingFrequency: { type: String, enum: ['daily', 'weekly'], required: true },
  timeCommitment: { type: Number, required: true },
  learningGoals: { type: String },
  preferredResources: { type: String },
  topics: [
    {
      topicName: { type: String, required: true },
      timeRecommended: { type: Number, required: true },
      order: { type: Number, required: true },
      resources: [
        {
          resourceType: { type: String, required: true },
          resourceLink: { type: String, required: true }
        }
      ],
      completed: { type: Boolean, default: false }
    }
  ],
  progress: {
    completionPercentage: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Export Course model
const Course = mongoose.model('Course', CourseSchema);
export default Course;
