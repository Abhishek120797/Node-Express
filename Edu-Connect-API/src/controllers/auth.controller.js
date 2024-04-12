import { user_model } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import registerMail from "../utils/registerMail.js";

const generateAccessAndRefreshToken = async (user_Id) => {
  try {
    const user_object = await user_model.findByPk(user_Id);
    const accessToken = user_object.generateAccessToken();
    const newRefreshToken = user_object.generateRefreshToken();

    user_object.refreshToken = newRefreshToken;
    await user_object.save({ fields: ["refreshToken"] });

    return { accessToken, newRefreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token",
      [error]
    );
  }
};

const register = asyncHandler(async (req, res) => {
  const { fName, lName, email, contact, user_type, password } = req.body;

  const user_object = {
    first_name: fName,
    last_name: lName,
    email: email,
    contact_number: contact,
    user_type: user_type,
    password: password,
  };

  const user = await user_model.create(user_object);

  const created_user = await user_model.findByPk(user.user_id, {
    attributes: { exclude: ["password", "refreshToken"] },
  });

  if (!created_user) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  // await registerMail(created_user.email);

  return res
    .status(201)
    .json(new ApiResponse(201, created_user, "User registered successfully"));
});

const logIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user_object = await user_model.findOne({ where: { email: email } });

  if (!user_object) {
    throw new ApiError(404, "user does not exist");
  }

  const isPasswordValid = await user_object.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "wrong password");
  }

  const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(
    user_object.user_id
  );

  const logedInUser = await user_model.findByPk(user_object.user_id, {
    attributes: { exclude: ["password", "refreshToken"] },
  });

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
        201,
        { user: logedInUser, accessToken, newRefreshToken },
        "Loged In in succesfully"
      )
    );
});

const logOut = asyncHandler(async (req, res) => {
  const { user_id } = req.user;
  const user_object = await user_model.findByPk(user_id);

  if (user_object) {
    user_object.refreshToken = null;
    await user_object.save();
  }

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

        const user_object = await user_model.findByPk(decoded.user_id);

        if (!user_object) {
          throw new ApiError(401, "Invalid Refresh Token");
        }

        if (incommingRefreshToken !== user_object?.refreshToken) {
          throw new ApiError(401, "Refresh token is expired or used");
        }

        const options = {
          httpOnly: true,
          secure: true,
        };

        const { accessToken, newRefreshToken } =
          await generateAccessAndRefreshToken(user_object.user_id);

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

export { register, logIn, logOut, refreshAccessToken };