import { ApiError } from "../utils/ApiError.js";

const verifyEnrollment = (req, _, next) => {
  const { courseTitle } = req.body;
  if (!courseTitle) {
    throw new ApiError(404, "Course title is required for enrollment");
  }
  next();
};

export { verifyEnrollment };
