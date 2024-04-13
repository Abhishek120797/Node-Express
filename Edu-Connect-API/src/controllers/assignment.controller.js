import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { assignment_model } from "../models/assignment.model.js";
import { course_model } from "../models/course.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addAssignment = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const { courseTitle } = req.params;
  const assignmentPath = req.file?.path;

  const course_object = await course_model.findOne({
    where: { title: courseTitle },
  });

  if (!course_object) {
    throw new ApiError(404, "course not found please check course title");
  }

  if (!assignmentPath) {
    throw new ApiError(404, "Assignment path not found");
  }
  const assignment = await uploadOnCloudinary(assignmentPath, "raw");

  const assignment_object = {
    title: title,
    description: description ?? null,
    assignment_url: assignment.url,
    course_id: course_object.course_id,
  };

  const created_assignment = await assignment_model.create(assignment_object);

  if (created_assignment) {
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          created_assignment,
          "assignment created successfully"
        )
      );
  } else {
    throw new ApiError(500, "Something went wrong while creating assignment");
  }
});

const getAssignment = asyncHandler(async (req, res) => {
  const assignments = await assignment_model.findAll();

  return res
    .status(201)
    .json(new ApiResponse(201, assignments, "assignment fetched successfully"));
});

const getAssignmentByCourse = asyncHandler(async (req, res) => {
  const { courseTitle } = req.params;
  const course_object = await course_model.findOne({
    where: { title: courseTitle },
  });

  if (!course_object) {
    throw new ApiError(404, "course not found");
  }

  const assignments = await assignment_model.findAll({
    where: { course_id: course_object.course_id },
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        assignments,
        "Assignment fetched successfully by course"
      )
    );
});

const updateAssignment = asyncHandler(async (req, res) => {
  const { courseTitle, assignmentTitle } = req.params;
  const { title, description } = req.body;
  const assignmentPath = req.file?.path;

  const course_object = await course_model.findOne({
    where: { title: courseTitle },
  });

  const assignment_object = await assignment_model.findOne({
    where: { title: assignmentTitle, course_id: course_object.course_id },
  });

  if (!assignment_object) {
    throw new ApiError(404, "Assignment not found");
  }
  let assignment;
  if (assignmentPath) {
    assignment = await uploadOnCloudinary(assignmentPath, "raw");
  }

  if (title) assignment_object.title = title;
  if (description) assignment_object.description = description;
  if (assignment) assignment_object.assignment_url = assignment.url;

  await assignment_object.save();

  const updated_assignment = await assignment_model.findByPk(
    assignment_object.assignment_id
  );

  if (updated_assignment) {
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          updated_assignment,
          "Assignment updated successfully"
        )
      );
  } else {
    throw new ApiError(500, "Something went wrong while updating assignment");
  }
});

const deleteAssignment = asyncHandler(async (req, res) => {
  const { courseTitle, assignmentTitle } = req.params;
  const course_object = await course_model.findOne({
    where: { title: courseTitle },
  });

  const assignment_object = await assignment_model.findOne({
    where: { title: assignmentTitle, course_id: course_object.course_id },
  });

  if (!assignment_object) {
    throw new ApiError(404, "assignment not found");
  }
  const deleted_assignment = await assignment_object.destroy();

  if (deleted_assignment) {
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          deleted_assignment,
          "assignment deleted successfully"
        )
      );
  } else {
    return res
      .status(500)
      .json(
        new ApiError(500, "Internal server error while deleting assignment")
      );
  }
});

export {
  addAssignment,
  getAssignment,
  getAssignmentByCourse,
  updateAssignment,
  deleteAssignment,
};
