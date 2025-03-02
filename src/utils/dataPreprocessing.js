async function preprocessData(reqBody) {
  // Extract parameters
  let {
    course,
    difficulty,
    schedulingFrequency,
    timeCommitment,
    learningGoals,
    preferredResources,
  } = reqBody;

  // Data Cleaning
  course = course?.trim();
  difficulty = difficulty?.toLowerCase().trim();
  schedulingFrequency = schedulingFrequency?.toLowerCase().trim();
  timeCommitment = parseFloat(timeCommitment); // Ensure it's a number
  learningGoals = Array.isArray(learningGoals)
    ? learningGoals.map((goal) => goal.trim()).filter(Boolean) // Remove empty entries
    : [];
  preferredResources = Array.isArray(preferredResources)
    ? preferredResources.map((resource) => resource.trim().toLowerCase()).filter(Boolean)
    : [];

  // Data Validation
  if (!course) throw new Error("Course name is required.");
  if (!difficulty || !["beginner", "intermediate", "advanced"].includes(difficulty))
    throw new Error("Invalid difficulty level. Choose beginner, intermediate, or advanced.");
  if (!schedulingFrequency || !["daily", "weekly"].includes(schedulingFrequency))
    throw new Error("Invalid scheduling frequency. Choose daily or weekly.");
  if (isNaN(timeCommitment) || timeCommitment <= 0)
    throw new Error("Time commitment must be a positive number.");

  // Data Transformation
  return {
    course,
    difficulty,
    schedulingFrequency,
    timeCommitment,
    learningGoals,
    preferredResources,
  };
}

export default preprocessData;