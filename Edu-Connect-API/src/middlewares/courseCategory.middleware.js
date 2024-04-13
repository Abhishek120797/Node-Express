import { course_category } from "../models/courseCategory.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyCourseCategory = asyncHandler(async (req, res, next) => {
  const { title } = req.body;

  if (!title) {
    throw new ApiError(400, "Category title is required");
  }

  const category = await course_category.findOne({ where: { title: title } });

  if (category) {
    throw new ApiError(409, "Category allready exist");
  }

  next();
});

const verifyCourseCategoryTitle = asyncHandler((req, res, next) => {
  const { categoryTitle } = req.params;

  if (!categoryTitle || categoryTitle === ":categoryTitle") {
    throw new ApiError(404, "course category title is required");
  }
  next();
});

const verifyUpdateCourseCategory = asyncHandler((req, res, next) => {
  const { title, description } = req.body;
  if (!(title || description)) {
    throw new ApiError(404, "provide at least one field to update");
  }
  next();
});

export {
  verifyCourseCategory,
  verifyCourseCategoryTitle,
  verifyUpdateCourseCategory,
};
