import sequelize from "./dbInstance.js";
import "../models/assignment.model.js";
import "../models/course.model.js";
import "../models/courseCategory.model.js";
import { user_model } from "../models/user.model.js";
import "../models/userCourses.model.js";
import "../models/video.model.js";
import "../models/association.js";

const connectDB = async () => {
  try {
    await sequelize.authenticate();

    console.log(
      "Connection has been established successfully to Neon database"
    );

    await sequelize.sync();
    console.log("All models synchronized");

    await init();
  } catch (error) {
    console.log("Unable to connect to the database: ", error);
    process.exit(1);
  }
  return sequelize;
};

async function init() {
  try {
    let admin = await user_model.findOne({ where: { user_type: "ADMIN" } });
    if (admin) {
      console.log("admin is already present");
      return;
    }
  } catch (error) {
    console.log("Error while finding the ADMIN data : ", error);
  }

  try {
    const admin = await user_model.create({
      first_name: "Abhishek",
      last_name: "Jaiswal",
      email: process.env.ADMIN_EMAIL,
      contact_number: process.env.ADMIN_CONTACT,
      password: process.env.ADMIN_PASSWORD,
      user_type: "ADMIN",
      verified: true,
    });
    console.log("Admin created ", admin);
  } catch (error) {
    console.log("Error while creating admin : ", error);
  }
}

export default connectDB;
