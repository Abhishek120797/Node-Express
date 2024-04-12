import { Router } from "express";

import {
  verifyToken,
  isInstructorOrAdmin,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(verifyToken);

//secured routes only for admin and instructor
router.route("/").post(verifyToken, isInstructorOrAdmin);

router.route("/:courseId").patch(verifyToken, isInstructorOrAdmin);

router.route("/:courseId").delete(verifyToken, isInstructorOrAdmin);

export default router;
