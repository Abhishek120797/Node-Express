import { Router } from "express";

import {
  verifyToken,
  isInstructorOrAdmin,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(verifyToken);

router.route("/:courseId").get(verifyToken);

router.route("/:courseId").post(verifyToken, isInstructorOrAdmin);

router.route("/:videoId").patch(verifyToken, isInstructorOrAdmin);

router.route("/:videoId").delete(verifyToken, isInstructorOrAdmin);

export default router;
