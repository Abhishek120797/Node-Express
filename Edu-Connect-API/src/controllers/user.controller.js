import { user_model } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getUserProfile = asyncHandler(async (req, res) => {
  const user_object = await user_model.findByPk(req.user.user_id, {
    attributes: { exclude: ["password", "refreshToken"] },
  });

  if (user_object) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, user_object, "User details fetched successfully")
      );
  } else {
    throw new ApiError(500, "Somwthing went wrong when fetching user details");
  }
});

export { getUserProfile };
