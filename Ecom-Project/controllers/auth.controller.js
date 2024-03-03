require("dotenv").config();
const bcrypt = require("bcryptjs");
const user_model = require("../models/user.model");
const jwt = require("jsonwebtoken");

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
    res.status(201).send(user);
  } catch (error) {
    console.log("Error while registering user ", error);
    res.status(500).send({
      message: "Some error happend",
    });
  }
};

exports.signin = async (req, res) => {
  const req_userId = req.body.userId;
  const req_password = req.body.password;
  const user = await user_model.findOne({ userId: req_userId });

  if (!user) {
    return res.status(400).send({
      message: "userId  passed is not a valid userId",
    });
  }

  const isPasswordValid = bcrypt.compareSync(req_password, user.password);

  if (!isPasswordValid) {
    return res.status(401).send({
      message: "wrong password given",
    });
  }

  const token = jwt.sign({ userId: user.userId }, process.env.SECRET, {
    expiresIn: 600,
  });

  res.status(200).send({
    name: user.name,
    userId: user.userId,
    email: user.email,
    userType: user.userType,
    accessToken: token,
  });
};
