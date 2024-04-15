import { Router } from "express";
import {
  enrollInCourse,
  getEnrolledCourse,
} from "../controllers/enrollment.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { verifyEnrollment } from "../middlewares/enrollment.middleware.js";

const router = Router();

router.route("/").get(verifyToken, getEnrolledCourse);
router.route("/").post(verifyToken, verifyEnrollment, enrollInCourse);

export default router;
