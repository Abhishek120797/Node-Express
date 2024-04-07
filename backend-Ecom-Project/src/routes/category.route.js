import { Router } from "express";

import {
  createNewCategory,
  deleteCategory,
  updateCategory,
  getCategory,
} from "../controllers/category.controller.js";

import { verifyToken, isAdmin } from "../middlewares/auth.mw.js";

import {
  categoryCheck,
  categoryNameCheck,
} from "../middlewares/category.mw.js";

const router = Router();

router.route("/").get(verifyToken, getCategory);

router
  .route("/:name")
  .patch(verifyToken, isAdmin, categoryNameCheck, updateCategory);

router
  .route("/:name")
  .delete(verifyToken, isAdmin, categoryNameCheck, deleteCategory);

router.route("/").post(verifyToken, isAdmin, categoryCheck, createNewCategory);

export default router;
