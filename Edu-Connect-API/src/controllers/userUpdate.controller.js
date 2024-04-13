import { user_model } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user_object = await user_model.findByPk(req.user.user_id);

  const isPasswordCorrect =
    await user_object.isPasswordCorrect(currentPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invaild old password");
  }

  user_object.password = newPassword;

  await user_object.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password successfully changed"));
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { fName, lName, contact, email } = req.body;
  const user_object = await user_model.findByPk(req.user?.user_id);

  if (user_object) {
    if (fName) user_object.first_name = fName;
    if (lName) user_object.last_name = lName;
    if (contact) user_object.contact_number = contact;
    if (email) user_object.email = email;
  }

  await user_object.save();

  const updated_user = await user_model.findByPk(user_object.user_id, {
    attributes: { exclude: ["password", "refreshToken"] },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, updated_user, "profile updated successfully"));
});

const updateAvatar = asyncHandler(async (req, res) => {
  const localImagePath = req.file.path;

  if (!localImagePath) {
    throw new ApiError(400, "Avatar image path is required");
  }

  const avatarImage = await uploadOnCloudinary(localImagePath, "image");

  if (!avatarImage) {
    throw new ApiError(400, "uploaded Avatar image is required");
  }

  const user_object = await user_model.findByPk(req.user.user_id);

  user_object.avatar = avatarImage.url;

  await user_object.save();

  const updated_user = await user_model.findByPk(user_object.user_id, {
    attributes: { exclude: ["password", "refreshToken"] },
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, updated_user, "avatar image updated successfully")
    );
});

export { updateUserProfile, updatePassword, updateAvatar };
