const user_model = require("../models/user.model");
const jwt = require("jsonwebtoken");
const auth_config = require("../config/auth.config");

const veryfySignUpBody = async (req, res, next) => {
  try {
    if (!req.body.name) {
      return res.status(400).send({
        message: "name not provided",
      });
    }
    if (!req.body.email) {
      return res.status(400).send({
        message: "email not provided",
      });
    }
    if (!req.body.userId) {
      return res.status(400).send({
        message: "userId not provided",
      });
    }
    if (!req.body.password) {
      return res.status(400).send({
        message: "password not provided",
      });
    }

    const user = await user_model.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send({
        message: "user already registerd with this email you provided",
      });
    }

    next();
  } catch (error) {
    console.log("Error while verifying req body ", error);
    res.status(500).send({
      message: "Error while validating the request body",
    });
  }
};

const veryfySignInBody = async (req, res, next) => {
  if (!req.body.userId) {
    return res.status(400).send({
      message: "userId is not provided",
    });
  }
  if (!req.body.password) {
    return res.status(400).send({
      message: "password is not provided",
    });
  }
  next();
};

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token found : Unauthorised",
    });
  }

  jwt.verify(token, auth_config.secret, async (error, decoded) => {
    if (error) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }

    const user = await user_model.findOne({ userId: decoded.userId });

    if (!user) {
      return res.status(400).send({
        message: "Unauthorized, this user for this token does not exist",
      });
    }

    req.user = user;

    next();
  });
};

const isAdmin = (req, res, next) => {
  const user = req.user;
  if (user && user.userType == "ADMIN") {
    next();
  } else {
    return res.status(403).send({
      message: "Only admin users are allowed to access this endpoint",
    });
  }
};

module.exports = {
  veryfySignUpBody: veryfySignUpBody,
  veryfySignInBody: veryfySignInBody,
  verifyToken: verifyToken,
  isAdmin: isAdmin,
};
