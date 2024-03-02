require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const user_model = require("./models/user.model");
const bcrypt = require("bcryptjs");

app.use(express.json());

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

db.on("error", () => {
  console.log("Error while connecting database");
});

db.once("open", () => {
  console.log("Connected to database");
  init();
});

async function init() {
  try {
    let user = await user_model.findOne({ userId: "admin" });
    if (user) {
      console.log("admin is already present");
      return;
    }
  } catch (error) {
    console.log("error while reading the data");
  }

  try {
    user = await user_model.create({
      name: "Abhishek",
      userId: "admin",
      email: "abhi.jais1211@gmail.com",
      userType: "ADMIN",
      password: bcrypt.hashSync("admin", 8),
    });
    console.log("Admin created ", user);
  } catch (error) {
    console.log("error: ", error);
  }
}

require("./routes/auth.route")(app);
require("./routes/category.route")(app);
require("./routes/product.route")(app);

app.listen(process.env.PORT, () => {
  console.log("server started at port number : ", process.env.PORT);
});
