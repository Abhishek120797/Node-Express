import { user_model } from "../models/user.model.js";
import sequelize from "./dbInstance.js";

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
      email: "abhi.jais1211@gmail.com",
      contact_number: "7758938495",
      password: "admin@123",
      user_type: "ADMIN",
    });
    console.log("Admin created ", admin);
  } catch (error) {
    console.log("Error while creating admin : ", error);
  }
}

export default connectDB;
