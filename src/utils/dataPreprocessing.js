const resourceMapping = {
  "video": "video",
  "videos": "video",
  "youtube videos": "video",
  "youtube": "video",
  "lecture videos": "video",
  "article": "article",
  "articles": "article",
  "online articles": "article",
  "blog": "article",
  "interactive tutorial": "interactive tutorial",
  "tutorial": "interactive tutorial",
  "interactive learning": "interactive tutorial",
};

const normalizeResource = (resource) => {
  const formatted = resource.trim().toLowerCase();
  return resourceMapping[formatted] || null;
};

async function preprocessData(reqBody) {
  let {
    courseName,
    difficultyLevel,
    schedulingFrequency,
    timeCommitment,
    learningGoals,
    preferredResources,
  } = reqBody;

  console.log(courseName, difficultyLevel, schedulingFrequency, timeCommitment, learningGoals, preferredResources);
  if (typeof learningGoals === "string") {
    learningGoals = learningGoals.split(",").map((goal) => goal.trim()).filter(Boolean);
  }

  if (typeof preferredResources === "string") {
    preferredResources = preferredResources.split(",").map((resource) => resource.trim()).filter(Boolean);
  }

  // **Data Cleaning & Normalization**
  courseName = courseName?.trim();
  difficultyLevel = difficultyLevel?.toLowerCase().trim();
  schedulingFrequency = schedulingFrequency?.toLowerCase().trim();
  timeCommitment = parseFloat(timeCommitment);
  learningGoals = Array.isArray(learningGoals)
    ? [...new Set(learningGoals.map((goal) => goal.trim()))].filter(Boolean)
    : [];
  preferredResources = Array.isArray(preferredResources)
    ? [...new Set(preferredResources.map(normalizeResource))].filter(Boolean)
    : [];

  const errors = [];

  if (!courseName || courseName.length < 3 || courseName.length > 100)
    errors.push("Course name must be between 3 and 100 characters.");
  if (!difficultyLevel || !["beginner", "intermediate", "advanced"].includes(difficultyLevel))
    errors.push("Invalid difficulty level. Choose beginner, intermediate, or advanced.");
  if (!schedulingFrequency || !["daily", "weekly"].includes(schedulingFrequency))
    errors.push("Invalid scheduling frequency. Choose daily or weekly.");
  if (isNaN(timeCommitment) || timeCommitment < 0.5 || timeCommitment > 24)
    errors.push("Time commitment must be between 0.5 and 24 hours.");
  if (learningGoals.length > 5)
    errors.push("You can specify up to 5 learning goals.");
  if (preferredResources.length === 0)
    errors.push("At least one valid preferred resource is required.");

  if (errors.length > 0) {
    throw new Error(errors.join(" "));
  }

  return {
    courseName,
    difficultyLevel,
    schedulingFrequency,
    timeCommitment,
    learningGoals,
    preferredResources,
  };
}

export default preprocessData;
