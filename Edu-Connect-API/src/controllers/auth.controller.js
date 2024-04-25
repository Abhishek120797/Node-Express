import { user_model } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import {
  sendRegisterMail,
  sendVerificationMail,
} from "../utils/registerMail.js";

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

  const userByEmail = await user_model.findOne({ where: { email: email } });

  if (!userByEmail) {
    const user_object = {
      first_name: fName,
      last_name: lName,
      email: email,
      contact_number: contact,
      user_type: user_type,
      password: password,
      verified: false,
    };
    const user = await user_model.create(user_object);
    if (!user) {
      throw new ApiError(500, "Something went wrong while registering user");
    }
    return res
      .status(201)
      .json(new ApiResponse(201, user, "registration details saved"));
  } else {
    userByEmail.password = password;
    await userByEmail.save();
    return res
      .status(201)
      .json(new ApiResponse(201, userByEmail, "registration details saved"));
  }
});

const verificationRegister = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await user_model.findOne({ where: { email: email } });

  if (user) {
    if (!user.verified) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      user.verification_Code = code;
      await user.save();

      const { success, message } = await sendVerificationMail(email, code);

      if (!success) {
        throw new ApiError(500, message);
      } else {
        return res.status(201).json(new ApiResponse(201, {}, message));
      }
    } else {
      throw new ApiError(409, "user already registerd and verified");
    }
  } else {
    throw new ApiError(404, "user not registered");
  }
});

const checkVerificationCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  const user = await user_model.findOne({ where: { email: email } });

  if (user) {
    if (user.verification_Code == code) {
      user.verified = true;
      await user.save();
      const { success, message } = await sendRegisterMail(email);

      if (success) {
        return res
          .status(201)
          .json(
            new ApiResponse(
              201,
              {},
              "user registration verification done successfully"
            )
          );
      } else {
        return res.status(500).json(new ApiError(500, message));
      }
    } else {
      throw new ApiError(400, "Incorrect verification code");
    }
  }

  throw new ApiError(404, "User not register");
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
    secure: false,
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
    secure: false,
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
          secure: false,
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

export {
  register,
  logIn,
  logOut,
  refreshAccessToken,
  verificationRegister,
  checkVerificationCode,
};
