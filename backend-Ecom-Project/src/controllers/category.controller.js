import { category_model } from "../models/category.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createNewCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const cat_data = { name: name, description: description };

  const category = await category_model.create(cat_data);

  if (!category) {
    throw new ApiError(500, "Something went wrong while registering user");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, category, "category created successfully"));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { name } = req.params;

  const category_deleted = await category_model.findOneAndDelete({
    name: name,
  });

  if (!category_deleted) {
    throw new ApiError(404, "Category not found");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, category_deleted, "category deleted"));
});

const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.params;
  const { name: newName, description } = req.body;

  if (!newName && !description) {
    throw new ApiError(
      400,
      "Provide at least one field (name or description) to update"
    );
  }

  const updates = {};
  if (newName) {
    updates.name = newName;
  }
  if (description) {
    updates.description = description;
  }

  const category_updated = await category_model.findOneAndUpdate(
    { name: name },
    { $set: updates }
  );

  if (!category_updated) {
    throw new ApiError(404, "Category not found");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, category_updated, "category updated"));
});

const getCategory = asyncHandler(async (req, res) => {
  const category_list = await category_model.find();

  return res.status(201).json(new ApiResponse(201, category_list));
});

export { createNewCategory, deleteCategory, updateCategory, getCategory };
