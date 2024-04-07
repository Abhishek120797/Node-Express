import { ApiError } from "../utils/ApiError.js";

const checkProductName = (req, _, next) => {
  const product = req.body.product || req.params.product;

  if (!product) {
    throw new ApiError(400, "product name is required");
  }
  next();
};

export { checkProductName };
