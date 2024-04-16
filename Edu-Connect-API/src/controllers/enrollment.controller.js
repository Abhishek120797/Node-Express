import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { user_course_model } from "../models/userCourses.model.js";
import { course_model } from "../models/course.model.js";
import { sendCourseEnrollmentMail } from "../utils/registerMail.js";

const enrollInCourse = asyncHandler(async (req, res) => {
  const { courseTitle } = req.body;
  const user = req.user;

  const course = await course_model.findOne({ where: { title: courseTitle } });
  console.log(course);

  if (!course) {
    return res.status(404).json(new ApiResponse(404, null, "Course not found"));
  }

  const enrollment = await user_course_model.findOne({
    where: { user_id: user.user_id, course_id: course.course_id },
  });

  if (enrollment) {
    throw new ApiError(409, "user already enrolled in the course");
  }

  await user_course_model.create({
    user_id: user.user_id,
    course_id: course.course_id,
  });

  const { success, message } = await sendCourseEnrollmentMail(user.email);

  if (!success) {
    throw new ApiError(500, message);
  }

  return res.status(200).json(new ApiResponse(200, "Enrollment successful"));
});

const getEnrolledCourse = asyncHandler(async (req, res) => {
  const user = req.user;
  const mycourses = await user_course_model.findAll({
    where: { user_id: user.user_id },
  });

  if (mycourses.length === 0) {
    return res
      .status(404)
      .json(
        new ApiResponse(404, mycourses, "You are not enrolled in any course")
      );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, mycourses, "Your Enrolled courses find successfully")
    );
});

export { enrollInCourse, getEnrolledCourse };
