import { Router } from "express";

import {
  verifyToken,
  isInstructorOrAdmin,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(verifyToken);
router.route("/:courseId").get(verifyToken, isInstructorOrAdmin);
router.route("/:assignmentId").get(verifyToken, isInstructorOrAdmin);

router.route("/:courseId").post(verifyToken, isInstructorOrAdmin);

router.route("/:assignmentId").patch(verifyToken, isInstructorOrAdmin);

router.route("/:assignmentId").delete(verifyToken, isInstructorOrAdmin);

export default router;
