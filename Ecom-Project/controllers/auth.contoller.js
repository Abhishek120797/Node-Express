const bcrypt = require("bcryptjs");
const user_model = require("../models/user.model");

exports.signUp = async (req, res) => {
  const request_body = req.body;

  const userObj = {
    name: request_body.name,
    userId: request_body.userId,
    email: request_body.email,
    userType: request_body.userType,
    password: bcrypt.hashSync(request_body.password, 8),
  };

  try {
    const user = await user_model.create(userObj);

    const res_user = {
      name: user.name,
      userId: user.userId,
      email: user.email,
      userType: user.userType,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    res.status(201).send(res_user);
  } catch (error) {
    console.log("Error while registering user ", error);
    res.status(500).send({
      message: "Some error happend",
    });
  }
};
