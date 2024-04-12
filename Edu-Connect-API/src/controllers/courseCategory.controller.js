import { course_category } from "../models/courseCategory.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createCourseCategory = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const category_object = {
    title: title,
    description: description ?? null,
  };

  const created_category = await course_category.create(category_object);

  if (created_category) {
    return res
      .status(201)
      .json(
        new ApiResponse(201, created_category, "category created successfully")
      );
  } else {
    throw new ApiError(500, "something went wromg while creating category");
  }
});

const getCourseCategorybyTitle = asyncHandler(async (req, res) => {
  const { categoryTitle } = req.params;

  const category = await course_category.findOne({
    where: {
      title: categoryTitle,
    },
  });

  if (category) {
    return res
      .status(201)
      .json(new ApiResponse(201, category, "category found"));
  } else {
    throw new ApiError(
      500,
      "something went wrong while finding course category by title"
    );
  }
});

const getCourseCategory = asyncHandler(async (req, res) => {
  const categories = await course_category.findAll();

  if (categories) {
    return res
      .status(201)
      .json(
        new ApiResponse(201, categories, "got all categories successfully")
      );
  } else {
    throw new ApiError(
      500,
      "something went wrong while finding all course category"
    );
  }
});

const updateCourseCategory = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const { categoryTitle } = req.params;

  const category_object = await course_category.findOne({
    where: { title: categoryTitle },
  });

  if (title) category_object.title = title;
  if (description) category_object.description = description;

  await category_object.save();

  const updated_category = await course_category.findOne({
    where: { title: categoryTitle },
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, updated_category, "category updated successfully")
    );
});

const deleteCourseCategory = asyncHandler(async (req, res) => {
  const { categoryTitle } = req.params;

  const deleted_category = await course_category.destroy({
    where: { title: categoryTitle },
  });

  if (deleted_category) {
    return res
      .status(201)
      .json(
        new ApiResponse(201, deleted_category, "category deleted successfully")
      );
  } else {
    throw new ApiError(
      500,
      "Something went wrong while deleting course category"
    );
  }
});

export {
  createCourseCategory,
  getCourseCategory,
  getCourseCategorybyTitle,
  updateCourseCategory,
  deleteCourseCategory,
};
