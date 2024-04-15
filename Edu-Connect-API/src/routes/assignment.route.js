import { Router } from "express";

import {
  verifyToken,
  isInstructorOrAdmin,
  isAdmin,
} from "../middlewares/auth.middleware.js";
import { verifyCourseTitle } from "../middlewares/course.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  verifyAssignmentCreation,
  verifyAssignment,
  verifyUpdateAssignment,
} from "../middlewares/assignment.middleware.js";

import {
  addAssignment,
  getAssignment,
  getAssignmentByCourse,
  updateAssignment,
  deleteAssignment,
} from "../controllers/assignment.controller.js";

const router = Router();

router.route("/").get(verifyToken, isAdmin, getAssignment);
router
  .route("/:courseTitle")
  .get(
    verifyToken,
    isInstructorOrAdmin,
    verifyCourseTitle,
    getAssignmentByCourse
  );

router
  .route("/:courseTitle")
  .post(
    verifyToken,
    isInstructorOrAdmin,
    upload.single("assignment"),
    verifyAssignmentCreation,
    addAssignment
  );

router
  .route("/:courseTitle/:assignmentTitle")
  .patch(
    verifyToken,
    isInstructorOrAdmin,
    upload.single("assignment"),
    verifyAssignment,
    verifyUpdateAssignment,
    updateAssignment
  );

router
  .route("/:courseTitle/:assignmentTitle")
  .delete(verifyToken, isInstructorOrAdmin, verifyAssignment, deleteAssignment);

export default router;
