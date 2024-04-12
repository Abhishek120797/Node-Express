import { course_model } from "../models/course.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addCourse = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    instructorId,
    price,
    duration,
    status,
    categoryId,
  } = req.body;

  const coverImagePath = req.file ? req.file.path : null;

  let coverImageUrl;

  if (coverImagePath) {
    coverImageUrl = await uploadOnCloudinary(coverImagePath);
  }

  const course_object = {
    title: title,
    description: description ?? null,
    instructor_id: instructorId,
    price: price,
    duration: duration,
    status: status ?? null,
    coverImage: coverImageUrl ?? null,
    category_id: categoryId,
  };

  const created_course = await course_model.create(course_object);

  if (created_course) {
    return res
      .status(201)
      .json(
        new ApiResponse(201, created_course, "Course created successfully")
      );
  } else {
    throw new ApiError(500, "Something went wrong when creating course");
  }
});

const deleteCourse = asyncHandler(async (req, res) => {});

const updateCourse = asyncHandler(async (req, res) => {});

const getCourse = asyncHandler(async (req, res) => {});

const getCourseByCategory = asyncHandler(async (req, res) => {});

export {
  addCourse,
  deleteCourse,
  updateCourse,
  getCourse,
  getCourseByCategory,
};
