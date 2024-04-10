import { Sequelize } from "sequelize";
import { db_name } from "../constants.js";

const sequelize = new Sequelize(
  `postgresql://${process.env.PG_USER}:${process.env.PG_PASS}@${process.env.PG_HOST}/${db_name}?sslmode=require`,
  {
    logging: false,
  }
);

export default sequelize;
