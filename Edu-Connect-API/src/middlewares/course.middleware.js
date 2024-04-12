import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { course_model } from "../models/course.model.js";

const verifyCourseCreation = asyncHandler(async (req, res, next) => {
  const { title, instructorId, price, duration, categoryId } = req.body;

  if (!title) {
    throw new ApiError(400, "course title required");
  }
  if (!instructorId) {
    throw new ApiError(400, "course instructor required");
  }
  if (!price) {
    throw new ApiError(400, "course price required");
  }
  if (!duration) {
    throw new ApiError(400, "course duration required");
  }
  if (!categoryId) {
    throw new ApiError(400, "course category required");
  }

  const course = await course_model.findOne({
    where: { title: title },
  });

  if (course) {
    throw new ApiError(409, "Course is Already present in course model");
  }
  next();
});

export { verifyCourseCreation };
