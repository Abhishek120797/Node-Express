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

//secured routes
router
  .route("/profile")
  .post(verifyToken, verifyUpdateUserProfileBody, updateUserProfile);

router
  .route("/password")
  .post(verifyToken, verifyUpdatePasswordBody, updatePassword);

router
  .route("/avatar")
  .post(
    verifyToken,
    upload.single("avatar"),
    verifyUpdateAvatarBody,
    updateAvatar
  );

export default router;
