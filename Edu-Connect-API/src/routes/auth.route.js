import { Router } from "express";

import {
  verifyRegisterBody,
  verifyLogInBody,
  verifyToken,
  verificationRegisterBody,
  verificationCode,
} from "../middlewares/auth.middleware.js";

import {
  register,
  logIn,
  logOut,
  refreshAccessToken,
  verificationRegister,
  checkVerificationCode,
} from "../controllers/auth.controller.js";

const router = Router();

router.route("/register").post(verifyRegisterBody, register);
router
  .route("/register/verifyRegister")
  .post(verificationRegisterBody, verificationRegister);
router
  .route("/register/verifyRegister/verifyCode")
  .post(verificationCode, checkVerificationCode);

router.route("/login").post(verifyLogInBody, logIn);

//secure routes

router.route("/logout").post(verifyToken, logOut);

router.route("/refresh-access-Token").post(refreshAccessToken);

export default router;
