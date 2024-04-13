import { Router } from "express";

import {
  verifyToken,
  isInstructorOrAdmin,
} from "../middlewares/auth.middleware.js";

import {
  addCourse,
  deleteCourse,
  updateCourse,
  getCourse,
  getCourseByCategory,
} from "../controllers/course.controller.js";

import { upload } from "../middlewares/multer.middleware.js";

import {
  verifyCourseCreation,
  verifyCourseUpdate,
  verifyCourseTitle,
} from "../middlewares/course.middleware.js";

import { verifyCourseCategoryTitle } from "../middlewares/courseCategory.middleware.js";

const router = Router();

router.route("/").get(verifyToken, getCourse);

router
  .route("/:categoryTitle")
  .get(verifyToken, verifyCourseCategoryTitle, getCourseByCategory);

//secured routes only for admin and instructor
router
  .route("/")
  .post(
    verifyToken,
    upload.single("coverImage"),
    isInstructorOrAdmin,
    verifyCourseCreation,
    addCourse
  );

router
  .route("/:courseTitle")
  .patch(
    verifyToken,
    isInstructorOrAdmin,
    upload.single("coverImage"),
    verifyCourseTitle,
    verifyCourseUpdate,
    updateCourse
  );

router
  .route("/:courseTitle")
  .delete(verifyToken, isInstructorOrAdmin, verifyCourseTitle, deleteCourse);

export default router;
