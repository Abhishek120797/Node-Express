import { ApiError } from "../utils/ApiError.js";

const verifyVideoCreation = (req, res, next) => {
  const { title } = req.body;
  const { courseTitle } = req.params;
  const video = req.file?.path;
  console.log(title);

  if (!title) {
    throw new ApiError(404, "video title  required");
  }
  if (!courseTitle) {
    throw new ApiError(404, "course title  required");
  }
  if (!video) {
    throw new ApiError(404, "video file required");
  }
  next();
};

const verifyVideo = (req, res, next) => {
  const { courseTitle, videoTitle } = req.params;

  if (!courseTitle) {
    throw new ApiError(404, "course title  required");
  }
  if (!videoTitle) {
    throw new ApiError(404, "video title is required");
  }
  next();
};

const verifyUpdateVideo = (req, res, next) => {
  const { title, description } = req.body;
  const videoPath = req.file?.path;

  if (!title && !description && !videoPath) {
    throw new ApiError(404, "provide at least one field to update");
  }
  next();
};

export { verifyVideoCreation, verifyVideo, verifyUpdateVideo };
