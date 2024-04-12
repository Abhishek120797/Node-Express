import { Router } from "express";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { getUserProfile } from "../controllers/user.controller.js";

const router = Router();

router.route("/profile").get(verifyToken, getUserProfile);

export default router;
