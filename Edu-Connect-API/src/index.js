import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error: ", error);
      throw error;
    });

    app.listen(process.env.PORT || 8000, () => {
      console.log("Server started at port number : ", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log("Database connection failed : ", error);
  });
