import { course_model } from "../models/course.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { course_category } from "../models/courseCategory.model.js";

const addCourse = asyncHandler(async (req, res) => {
  const { title, description, price, duration, status, categoryTitle } =
    req.body;

  const coverImagePath = req.file ? req.file.path : null;

  const category_object = await course_category.findOne({
    where: { title: categoryTitle },
  });

  let coverImageUrl;

  if (coverImagePath) {
    coverImageUrl = await uploadOnCloudinary(coverImagePath);
  }

  const course_object = {
    title: title,
    description: description ?? null,
    instructor_id: req.user.user_id,
    price: price,
    duration: duration,
    status: status ?? null,
    coverImage: coverImageUrl ?? null,
    category_id: category_object.category_id,
  };

  const created_course = await course_model.create(course_object);

  if (created_course) {
    return res
      .status(201)
      .json(
        new ApiResponse(201, created_course, "Course created successfully")
      );
  } else {
    throw new ApiError(500, "Something went wrong while creating course");
  }
});

const deleteCourse = asyncHandler(async (req, res) => {
  const { courseTitle } = req.params;

  const course_object = await course_model.findOne({
    where: { title: courseTitle },
  });

  if (course_object) {
    const deleted = course_object.destroy();

    if (deleted) {
      return res
        .status(201)
        .json(new ApiResponse(201, deleted, "Course deleted successfully"));
    } else {
      throw new ApiError(500, "internal server error while deleting course");
    }
  } else {
    return res.status(404).json(new ApiResponse(404, {}, "Course not found"));
  }
});

const updateCourse = asyncHandler(async (req, res) => {
  const { title, description, price, duration, status } = req.body;
  const { courseTitle } = req.params;

  const coverImagePath = req.file ? req.file.path : null;

  const course_object = await course_model.findOne({
    where: { title: courseTitle },
  });

  let coverImageUrl;

  if (coverImagePath) {
    coverImageUrl = await uploadOnCloudinary(coverImagePath);
  }

  if (title) course_object.title = title;
  if (description) course_object.description = description;
  if (price) course_object.price = price;
  if (duration) course_object.duration = duration;
  if (status) course_object.status = status;
  if (coverImageUrl) course_object.coverImage = coverImageUrl;

  await course_object.save();

  const updated_course = await course_model.findByPk(course_object.course_id);

  if (updated_course) {
    return res
      .status(201)
      .json(
        new ApiResponse(201, updated_course, "Course updated successfully")
      );
  } else {
    throw new ApiError(500, "Something went wrong while updating course");
  }
});

const getCourse = asyncHandler(async (req, res) => {
  const courses = await course_model.findAll();

  if (courses) {
    return res
      .status(201)
      .json(new ApiResponse(201, courses, "got courses successfully"));
  } else {
    throw new ApiError(500, "Internal server Error while fetching courses");
  }
});

const getCourseByCategory = asyncHandler(async (req, res) => {
  const { categoryTitle } = req.params;
  const category_object = await course_category.findOne({
    where: { title: categoryTitle },
  });

  if (category_object) {
    const courses = await course_model.findAll({
      where: { category_id: category_object.category_id },
    });

    if (courses) {
      return res
        .status(201)
        .json(new ApiResponse(201, courses, "courses fetched succesfully"));
    } else {
      throw new ApiError(500, "internal server error while fetching courses");
    }
  } else {
    return res
      .status(404)
      .json(
        new ApiResponse(404, category_object, "Provided category not exist")
      );
  }
});

export {
  addCourse,
  deleteCourse,
  updateCourse,
  getCourse,
  getCourseByCategory,
};
