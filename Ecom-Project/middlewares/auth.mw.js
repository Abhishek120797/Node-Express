const user_model = require("../models/user.model");

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

module.exports = {
  veryfySignUpBody: veryfySignUpBody,
};
