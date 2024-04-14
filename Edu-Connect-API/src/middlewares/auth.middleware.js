import { user_model } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const verifyRegisterBody = asyncHandler(async (req, res, next) => {
  const { fName, email, contact, user_type, password } = req.body;

  if (!fName) {
    throw new ApiError(400, "First name is required");
  }
  if (!email) {
    throw new ApiError(400, "email is required");
  }
  if (!contact) {
    throw new ApiError(400, "contact number is required");
  }
  if (!user_type) {
    throw new ApiError(400, "user_type is required");
  }
  if (!password) {
    throw new ApiError(400, "password is required");
  }

  const userByEmailAndVerified = await user_model.findOne({
    where: { email: req.body.email, verified: true },
    attributes: { exclude: ["password", "refreshToken"] },
  });

  if (userByEmailAndVerified) {
    return res
      .status(409)
      .json(
        new ApiResponse(
          409,
          userByEmailAndVerified,
          "user already registerd with this email you provided"
        )
      );
  }
  next();
});

const verifyLogInBody = asyncHandler((req, _, next) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "email is required");
  }
  if (!password) {
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

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user_object = await user_model.findByPk(decoded?.user_id, {
      attributes: { exclude: ["password", "refreshToken"] },
    });

    if (!user_object) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user_object;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

const isAdmin = (req, _, next) => {
  const user = req.user;

  if (user && user.user_type == "ADMIN") {
    next();
  } else {
    throw new ApiError(
      403,
      "Only ADMIN users are allowed to access this endpoint"
    );
  }
};

const isInstructorOrAdmin = (req, _, next) => {
  const user = req.user;

  if (user && (user.user_type === "INSTRUCTOR" || user.user_type === "ADMIN")) {
    next();
  } else {
    throw new ApiError(
      403,
      "Only INSTRUCTOR and ADMIN users are allowed to access this endpoint"
    );
  }
};

const verificationRegisterBody = (req, _, next) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(404, "email is required");
  }
  next();
};

const verificationCode = (req, _, next) => {
  const { email, code } = req.body;
  if (!email) {
    throw new ApiError(404, "email is required");
  }
  if (!code) {
    throw new ApiError(404, "code is required");
  }
  next();
};

export {
  verifyRegisterBody,
  verifyLogInBody,
  verifyToken,
  isAdmin,
  isInstructorOrAdmin,
  verificationRegisterBody,
  verificationCode,
};
