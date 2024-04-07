import { user_model } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifySignUpBody = asyncHandler(async (req, _, next) => {
  const { name, userId, email, password } = req.body;
  if (!name) {
    throw new ApiError(400, "name is required");
  }
  if (!email) {
    throw new ApiError(400, "email is required");
  }
  if (!userId) {
    throw new ApiError(400, "userId is required");
  }
  if (!password) {
    throw new ApiError(400, "password is required");
  }

  const userEmailCheck = await user_model.findOne({ email: req.body.email });
  if (userEmailCheck) {
    throw new ApiError(
      409,
      "user already registerd with this email you provided"
    );
  }

  const userIdCheck = await user_model.findOne({ userId: req.body.userId });
  if (userIdCheck) {
    throw new ApiError(
      409,
      "user already registerd with this UserId you provided"
    );
  }
  next();
});

const verifySignInBody = asyncHandler(async (req, _, next) => {
  if (!req.body.userId) {
    throw new ApiError(400, "userId is required");
  }
  if (!req.body.password) {
    throw new ApiError(400, "password is required");
  }
  next();
});

const verifyToken = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(403, "No token found : Unauthorised");
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, decoded) => {
    try {
      if (error) {
        throw new ApiError(401, "Unauthorized!");
      }
      const user = await user_model
        .findById(decoded?._id)
        .select("-password -refreshToken");

      if (!user) {
        throw new ApiError(401, "Invalid access token");
      }

      req.user = user;
      next();
    } catch (error) {
      throw new ApiError(401, error?.message || "Invalid access token");
    }
  });
});

const isAdmin = (req, _, next) => {
  const user = req.user;
  if (user && user.userType == "ADMIN") {
    next();
  } else {
    throw new ApiError(
      403,
      "Only admin users are allowed to access this endpoint"
    );
  }
};

export { verifySignUpBody, verifySignInBody, verifyToken, isAdmin };
