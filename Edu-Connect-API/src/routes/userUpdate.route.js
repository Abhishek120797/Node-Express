import { Router } from "express";

import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  verifyUpdateUserProfileBody,
  verifyUpdatePasswordBody,
  verifyUpdateAvatarBody,
} from "../middlewares/userUpdate.middleware.js";

import {
  updateUserProfile,
  updatePassword,
  updateAvatar,
} from "../controllers/userUpdate.controller.js";

import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/profile")
  .post(verifyUpdateUserProfileBody, verifyToken, updateUserProfile);

router
  .route("/password")
  .post(verifyUpdatePasswordBody, verifyToken, updatePassword);

router
  .route("/avatar")
  .post(
    verifyToken,
    upload.single("avatar"),
    verifyUpdateAvatarBody,
    updateAvatar
  );

export default router;
