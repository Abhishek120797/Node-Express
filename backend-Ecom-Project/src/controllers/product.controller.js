import { product_model } from "../models/product.model.js";
import { category_model } from "../models/category.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, category } = req.body;

  const categoryObject = await category_model.findOne({ name: category });

  if (!categoryObject) {
    throw new ApiError(400, "product category not found ");
  }

  const localImagePath = req.file.path;

  if (!localImagePath) {
    throw new ApiError(400, "Product local image path is required");
  }

  const productImage = await uploadOnCloudinary(localImagePath);

  if (!productImage) {
    throw new ApiError(400, "uploaded Product image is required");
  }

  const product = {
    name: name,
    description: description,
    productImage: productImage.url,
    price: price,
    stock: stock,
    category: categoryObject._id,
  };

  const product_added = await product_model.create(product);

  if (!product_added) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          product_added,
          "Product not added internal server error"
        )
      );
  }

  return res
    .status(201)
    .json(new ApiResponse(201, product_added, "Product added successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { name, category } = req.params;

  const categoryObject = await category_model.findOne({ name: category });
  const categoryId = categoryObject._id;

  const productDeleted = await product_model.findOneAndDelete({
    name: name,
    category: categoryId,
  });

  if (!productDeleted) {
    return res
      .status(404)
      .json(
        new ApiResponse(
          404,
          productDeleted,
          "product not found check your fields you provided"
        )
      );
  }
  return res
    .status(201)
    .json(new ApiResponse(201, productDeleted, "product deleted"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const productName = req.params.name;
  const categoryName = req.params.category;

  const categoryObj = await category_model.findOne({ name: categoryName });
  const { name, description, price, stock, category } = req.body;
  const localImagePath = req.file.path;

  if (
    !name &&
    !description &&
    !price &&
    !stock &&
    !category &&
    !localImagePath
  ) {
    throw new ApiError(404, "Provide at least one field to update");
  }

  const updates = {};
  if (name) {
    updates.name = name;
  }

  if (description) {
    updates.description = description;
  }

  if (localImagePath) {
    const productImage = await uploadOnCloudinary(localImagePath);
    updates.productImage = productImage.url;
  }

  if (price) {
    updates.price = price;
  }

  if (stock) {
    updates.stock = stock;
  }

  if (category) {
    const updateCategoryObj = await category_model.findOne({
      name: category,
    });
    updates.category = updateCategoryObj._id;
  }

  const updatedProduct = await product_model.findOneAndUpdate(
    { name: productName, category: categoryObj._id },
    { $set: updates }
  );

  if (!updatedProduct) {
    return res
      .status(500)
      .json(new ApiResponse(500, updateProduct, "product not found"));
  }

  return res
    .status(201)
    .json(new ApiResponse(201, updateProduct, "product is updated"));
});

const getProduct = asyncHandler(async (req, res) => {
  const product_list = await product_model.find();

  if (!product_list) {
    return res
      .status(404)
      .json(new ApiResponse(404, product_list, "Product not found"));
  }
  return res.status(200).json(new ApiResponse(201, product_list));
});

const getProductByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  console.log(category);

  const categoryObject = await category_model.findOne({ name: category });

  const product_list = await product_model.find({
    category: categoryObject._id,
  });

  if (!product_list) {
    return res
      .status(404)
      .json(new ApiResponse(404, product_list, "product not found"));
  }
  return res.status(201).json(new ApiResponse(201, product_list));
});

export {
  addProduct,
  deleteProduct,
  updateProduct,
  getProduct,
  getProductByCategory,
};
