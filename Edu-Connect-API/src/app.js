import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import userUpdateRoutes from "./routes/userUpdate.route.js";
import userRoutes from "./routes/user.route.js";
import assignmentRoutes from "./routes/assignment.route.js";
import videoRoutes from "./routes/video.route.js";
import courseRoutes from "./routes/course.route.js";
import courseCategoryRoutes from "./routes/courseCategory.route.js";
import enrollmentRoutes from "./routes/enrollement.route.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(express.static("public"));

app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/user-update", userUpdateRoutes);

app.use("/api/v1/user", userRoutes);

app.use("/api/v1/assignment", assignmentRoutes);

app.use("/api/v1/video", videoRoutes);

app.use("/api/v1/course", courseRoutes);

app.use("/api/v1/courseCategory", courseCategoryRoutes);

app.use("/api/v1/enrollment", enrollmentRoutes);

export { app };
