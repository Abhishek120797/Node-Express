import { category_model } from "../models/category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const categoryCheck = asyncHandler(async (req, _, next) => {
  const category = req.body;

  if (!category.name) {
    throw new ApiError(400, "category name is not provided");
  }

  if (!category.description) {
    throw new ApiError(400, "category description is not provided");
  }

  const checkCategoryPresent = await category_model.findOne({
    name: category.name,
  });

  if (checkCategoryPresent) {
    throw new ApiError(
      400,
      "This category name is already present try diferent category name"
    );
  }

  next();
});

const categoryNameCheck = asyncHandler((req, _, next) => {
  const name = req.params.name;

  if (!name) {
    throw new ApiError(400, "Category name is required");
  }
  next();
});

export { categoryCheck, categoryNameCheck };
