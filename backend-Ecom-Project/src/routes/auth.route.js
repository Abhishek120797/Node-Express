import { Router } from "express";

import {
  signUp,
  signIn,
  signOut,
  refreshAccessToken,
} from "../controllers/auth.controller.js";

import {
  verifySignUpBody,
  verifySignInBody,
  verifyToken,
} from "../middlewares/auth.mw.js";

const router = Router();

router.route("/signup").post(verifySignUpBody, signUp);

router.route("/signin").post(verifySignInBody, signIn);

router.route("/signout").post(verifyToken, signOut);

router.route("/refresh-access-token").post(refreshAccessToken);

export default router;
