import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { course_model } from "../models/course.model.js";

const verifyCourseCreation = asyncHandler(async (req, res, next) => {
  const { title, price, duration, categoryTitle } = req.body;

  if (!title) {
    throw new ApiError(400, "course title required");
  }
  if (!price) {
    throw new ApiError(400, "course price required");
  }
  if (!duration) {
    throw new ApiError(400, "course duration required");
  }
  if (!categoryTitle) {
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

const verifyCourseUpdate = asyncHandler((req, res, next) => {
  const { title, description, price, duration, status } = req.body;
  const coverImage = req.file?.path;

  if (!title && !description && !price && !duration && !status && !coverImage) {
    throw new ApiError(404, "Provide at least one field to update");
  }
  next();
});

const verifyCourseTitle = asyncHandler((req, res, next) => {
  const { courseTitle } = req.params;

  if (!courseTitle || courseTitle === ":courseTitle") {
    throw new ApiError(404, "course title is required");
  }
  next();
});

export { verifyCourseCreation, verifyCourseUpdate, verifyCourseTitle };
