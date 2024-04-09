import sequelize from "../db/dbInstance.js";
import { DataTypes } from "sequelize";

const course_model = sequelize.define(
  "Course",
  {
    course_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(1000),
    },
    instructor_id: {
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

(async () => {
  try {
    await course_model.sync();
    console.log("Course model created");
  } catch (error) {
    console.log("Error synchronizing Course model:", error);
  }
})();

export { course_model };
