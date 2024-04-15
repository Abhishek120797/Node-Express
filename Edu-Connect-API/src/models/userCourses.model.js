import sequelize from "../db/dbInstance.js";
import { DataTypes } from "sequelize";

const user_course_model = sequelize.define(
  "UserCourse",
  {
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    course_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export { user_course_model };
