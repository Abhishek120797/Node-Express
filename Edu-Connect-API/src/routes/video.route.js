import { Router } from "express";

import {
  verifyToken,
  isInstructorOrAdmin,
} from "../middlewares/auth.middleware.js";

import { verifyCourseTitle } from "../middlewares/course.middleware.js";

import {
  verifyVideoCreation,
  verifyVideo,
  verifyUpdateVideo,
} from "../middlewares/video.middleware.js";

import { upload } from "../middlewares/multer.middleware.js";

import {
  addVideo,
  getVideo,
  getVideoByCourse,
  updateVideo,
  deleteVideo,
} from "../controllers/video.controller.js";

const router = Router();

router.route("/").get(verifyToken, getVideo);

router
  .route("/:courseTitle")
  .get(verifyToken, verifyCourseTitle, getVideoByCourse);

router
  .route("/:courseTitle")
  .post(
    verifyToken,
    isInstructorOrAdmin,
    upload.single("video"),
    verifyVideoCreation,
    addVideo
  );

router
  .route("/:courseTitle/:videoTitle")
  .patch(
    verifyToken,
    isInstructorOrAdmin,
    upload.single("video"),
    verifyVideo,
    verifyUpdateVideo,
    updateVideo
  );

router
  .route("/:courseTitle/:videoTitle")
  .delete(verifyToken, isInstructorOrAdmin, verifyVideo, deleteVideo);

export default router;
