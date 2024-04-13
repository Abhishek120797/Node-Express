import { ApiError } from "../utils/ApiError.js";

const verifyAssignmentCreation = (req, res, next) => {
  const { title } = req.body;
  const { courseTitle } = req.params;
  const assignment = req.file?.path;
  if (!title) {
    throw new ApiError(404, "Assignment title  required");
  }
  if (!courseTitle) {
    throw new ApiError(404, "course title  required");
  }
  if (!assignment) {
    throw new ApiError(404, "Assignment file required");
  }
  next();
};

const verifyAssignment = (req, res, next) => {
  const { courseTitle, assignmentTitle } = req.params;

  if (!courseTitle) {
    throw new ApiError(404, "course title  required");
  }
  if (!assignmentTitle) {
    throw new ApiError(404, "Assignment title is required");
  }
  next();
};

const verifyUpdateAssignment = (req, res, next) => {
  const { title, description } = req.body;
  const assignmentPath = req.file?.path;

  if (!title && !description && !assignmentPath) {
    throw new ApiError(404, "provide at least one field to update");
  }
  next();
};

export { verifyAssignmentCreation, verifyAssignment, verifyUpdateAssignment };
