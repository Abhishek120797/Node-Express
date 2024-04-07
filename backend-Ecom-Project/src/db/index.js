import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { user_model } from "../models/user.model.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.DB_URL}/${DB_NAME}`
    );
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
    init();
  } catch (error) {
    console.log("MONGODB connection error ", error);
    process.exit(1);
  }
};

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
    let user = await user_model.create({
      name: "Admin",
      userId: "admin",
      email: "admin@gmail.com",
      userType: "ADMIN",
      password: "admin@123",
    });
    console.log("Admin created ", user);
  } catch (error) {
    console.log("error: ", error);
  }
}

export default connectDB;
