import { Router } from "express";

import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

import {
  verifyCourseCategory,
  verifyCourseCategoryTitle,
  verifyUpdateCourseCategory,
} from "../middlewares/courseCategory.middleware.js";

import {
  createCourseCategory,
  getCourseCategory,
  getCourseCategorybyTitle,
  updateCourseCategory,
  deleteCourseCategory,
} from "../controllers/courseCategory.controller.js";

const router = Router();

router.route("/").get(verifyToken, getCourseCategory);

router
  .route("/:categoryTitle")
  .get(
    verifyToken,
    isAdmin,
    verifyCourseCategoryTitle,
    getCourseCategorybyTitle
  );

router
  .route("/")
  .post(verifyToken, isAdmin, verifyCourseCategory, createCourseCategory);

router
  .route("/:categoryTitle")
  .patch(
    verifyToken,
    isAdmin,
    verifyCourseCategoryTitle,
    verifyUpdateCourseCategory,
    updateCourseCategory
  );

router
  .route("/:categoryTitle")
  .delete(
    verifyToken,
    isAdmin,
    verifyCourseCategoryTitle,
    deleteCourseCategory
  );

export default router;
