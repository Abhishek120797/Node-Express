import { Router } from "express";

import {
  verifyRegisterBody,
  verifyLogInBody,
  verifyToken,
} from "../middlewares/auth.middleware.js";

import {
  register,
  logIn,
  logOut,
  refreshAccessToken,
} from "../controllers/auth.controller.js";

const router = Router();

router.route("/register").post(verifyRegisterBody, register);

router.route("/login").post(verifyLogInBody, logIn);

//secure routes

router.route("/logout").post(verifyToken, logOut);

router.route("/refresh-access-Token").post(refreshAccessToken);

export default router;
