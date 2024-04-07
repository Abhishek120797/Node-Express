import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const productDetailsCheck = asyncHandler((req, _, next) => {
  const product = req.body;

  if (!product.name) {
    throw new ApiError(400, "product name is required");
  }
  if (!product.description) {
    throw new ApiError(400, "product description is required");
  }
  if (!product.category) {
    throw new ApiError(400, "product category is required");
  }
  next();
});

const categoryCheck = asyncHandler((req, _, next) => {
  const category = req.body.category || req.params.category;

  if (!category) {
    throw new ApiError(400, "Category name is required");
  }
  next();
});

const productNameCheck = asyncHandler((req, _, next) => {
  const name = req.params.name;
  if (!name) {
    throw new ApiError(400, "product name is required");
  }
  next();
});

export { productDetailsCheck, categoryCheck, productNameCheck };
