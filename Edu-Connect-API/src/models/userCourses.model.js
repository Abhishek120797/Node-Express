import sequelize from "../db/dbInstance.js";
import { user_model } from "./user.model.js";
import { course_model } from "./course.model.js";

const user_course_model = sequelize.define("UserCourse", {});

user_model.belongsToMany(course_model, { through: "UserCourse" });
course_model.belongsToMany(user_model, { through: "UserCourse" });

export { user_course_model };
