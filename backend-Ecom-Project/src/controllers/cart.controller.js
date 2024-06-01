import { cart_model } from "../models/cart.model.js";
import { product_model } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const addToCart = asyncHandler(async (req, res) => {
  const { product } = req.body;
  const productObject = await product_model.findOne({ name: product });

  if (!productObject) {
    throw new ApiError(404, "product not found");
  }
  const cartItem = {
    product: productObject._id,
    user: req.user.id,
  };
  const productAddedToCart = await cart_model.create(cartItem);

  return res
    .status(201)
    .json(new ApiResponse(201, productAddedToCart, "item added to cart"));
});

const getCart = asyncHandler(async (req, res) => {
  const userObjId = req.user.id;

  const cartItems = await cart_model.find({ user: userObjId });
  if (cartItems.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, cartItems, "Your Cart is empty"));
  }
  return res.status(201).json(new ApiResponse(201, cartItems));
});

const deleteFromCart = asyncHandler(async (req, res) => {
  const { product } = req.params;

  const productObject = await product_model.findOne({ name: product });
  const userObjId = req.user.id;
  const cartItemDeleted = await cart_model.findOneAndDelete({
    product: productObject._id,
    user: userObjId,
  });

  if (!cartItemDeleted) {
    return res.status(404).json(404, cartItemDeleted, "Item not found");
  }
  res
    .status(201)
    .json(new ApiResponse(201, cartItemDeleted, "cart item deleted"));
});

export { addToCart, getCart, deleteFromCart };
