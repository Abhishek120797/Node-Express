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

import { verifyCourseCreation } from "../middlewares/course.middleware.js";

const router = Router();

router.route("/").get(verifyToken, getCourse);

router.route("/courseCategoryId").get(verifyToken, getCourseByCategory);

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
  .route("/:courseId")
  .patch(verifyToken, isInstructorOrAdmin, updateCourse);

router
  .route("/:courseId")
  .delete(verifyToken, isInstructorOrAdmin, deleteCourse);

export default router;
