import { Router } from "express";

import { verifyToken } from "../middlewares/auth.mw.js";

import {
  addToCart,
  getCart,
  deleteFromCart,
} from "../controllers/cart.controller.js";

import { checkProductName } from "../middlewares/cart.mw.js";

const router = Router();

router.route("/").post(verifyToken, checkProductName, addToCart);

router.route("/").get(verifyToken, getCart);

router.route("/:product").delete(verifyToken, checkProductName, deleteFromCart);

export default router;
