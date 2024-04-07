import { asyncHandler } from "../utils/asyncHandler.js";
import { user_model } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await user_model.findById(userId);
    const accessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshToken = newRefreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, newRefreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const signUp = asyncHandler(async (req, res) => {
  const { name, userId, email, userType, password } = req.body;

  const userObj = {
    name: name,
    userId: userId.toLowerCase(),
    email: email,
    userType: userType,
    password: password,
  };

  const user = await user_model.create(userObj);

  const createdUser = await user_model
    .findById(user._id)
    .select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const signIn = asyncHandler(async (req, res) => {
  const { userId, password } = req.body;

  const user = await user_model.findOne({ userId: userId });

  if (!user) {
    throw new ApiError(404, "user does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "wrong password");
  }

  const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const logedInUser = await user_model
    .findById(user._id)
    .select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: logedInUser, accessToken, newRefreshToken },
        "Signed in succesfully"
      )
    );
});

const signOut = asyncHandler(async (req, res) => {
  await user_model.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user looged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incommingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incommingRefreshToken) {
    throw new ApiError(401, "Unauthorised request");
  }

  jwt.verify(
    incommingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (error, decoded) => {
      try {
        if (error) {
          throw new ApiError(401, "Unauthorised!");
        }
        const user = await user_model.findById(decoded?._id);

        if (!user) {
          throw new ApiError(401, "Invalid Refresh Token");
        }

        if (incommingRefreshToken !== user?.refreshToken) {
          throw new ApiError(401, "Refresh token is expired or used");
        }

        const options = {
          httpOnly: true,
          secure: true,
        };

        const { accessToken, newRefreshToken } =
          await generateAccessAndRefreshToken(user._id);

        return res
          .status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", newRefreshToken, options)
          .json(
            new ApiResponse(
              200,
              { accessToken, newRefreshToken },
              "Access token refreshed"
            )
          );
      } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token");
      }
    }
  );
});

export { signUp, signIn, signOut, refreshAccessToken };
