import sequelize from "../db/dbInstance.js";
import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const user_model = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    first_name: {
      type: DataTypes.STRING(125),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(125),
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    contact_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    user_type: {
      type: DataTypes.ENUM,
      values: ["STUDENT", "INSTRUCTOR", "ADMIN"],
      allowNull: false,
      defaultValue: "STUDENT",
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verification_Code: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    refreshToken: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

user_model.beforeUpdate((user) => {
  if (user.changed("password")) {
    user.password = bcrypt.hashSync(user.password, 8);
  }
});

user_model.beforeCreate((user) => {
  if (user.changed("password")) {
    user.password = bcrypt.hashSync(user.password, 8);
  }
});

user_model.prototype.isPasswordCorrect = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.log("Error while comparing password: ", error);
  }
};

user_model.prototype.generateAccessToken = function () {
  return jwt.sign({ user_id: this.user_id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

user_model.prototype.generateRefreshToken = function () {
  return jwt.sign({ user_id: this.user_id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

export { user_model };
