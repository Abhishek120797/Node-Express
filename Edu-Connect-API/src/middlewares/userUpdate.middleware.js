import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyUpdateUserProfileBody = asyncHandler(async (req, _, next) => {
  const { fName, lName, email, contact } = req.body;

  if (!fName && !lName && !email && !contact) {
    throw new ApiError(404, "Provide at least one field to update");
  }

  next();
});

const verifyUpdatePasswordBody = asyncHandler(async (req, _, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword) {
    throw new ApiError(404, "Provide current password for update");
  }
  if (!newPassword) {
    throw new ApiError(404, "Provide new password to update");
  }

  next();
});

const verifyUpdateAvatarBody = asyncHandler(async (req, _, next) => {
  if (!req.file) {
    throw new ApiError(404, "Provide avatar image for update");
  }

  next();
});

export {
  verifyUpdateUserProfileBody,
  verifyUpdatePasswordBody,
  verifyUpdateAvatarBody,
};
