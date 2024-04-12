import { Router } from "express";

import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(verifyToken);

router.route("/:courseCategoryId").get(verifyToken);

router.route("/").post(verifyToken, isAdmin);

router.route("/:courseCategoryId").patch(verifyToken, isAdmin);

router.route("/:courseCategoryId").delete(verifyToken, isAdmin);

export default router;
