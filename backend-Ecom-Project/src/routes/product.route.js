import { Router } from "express";

import {
  addProduct,
  deleteProduct,
  updateProduct,
  getProduct,
  getProductByCategory,
} from "../controllers/product.controller.js";

import { verifyToken, isAdmin } from "../middlewares/auth.mw.js";

import {
  productDetailsCheck,
  categoryCheck,
  productNameCheck,
} from "../middlewares/product.mw.js";

import { upload } from "../middlewares/multer.mw.js";

const router = Router();

router
  .route("/")
  .post(
    verifyToken,
    isAdmin,
    upload.single("productImage"),
    productDetailsCheck,
    categoryCheck,
    addProduct
  );

router.route("/").get(verifyToken, getProduct);

router
  .route("/:category")
  .get(verifyToken, categoryCheck, getProductByCategory);

router
  .route("/:name/:category")
  .delete(verifyToken, isAdmin, productNameCheck, categoryCheck, deleteProduct);

router
  .route("/:name/:category")
  .patch(
    verifyToken,
    isAdmin,
    upload.single("productImage"),
    productNameCheck,
    categoryCheck,
    updateProduct
  );

export default router;
