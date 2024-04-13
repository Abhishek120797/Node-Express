import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { video_model } from "../models/video.model.js";
import { course_model } from "../models/course.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const { courseTitle } = req.params;
  const videoPath = req.file?.path;

  const course_object = await course_model.findOne({
    where: { title: courseTitle },
  });

  if (!course_object) {
    throw new ApiError(404, "course not found please check course title");
  }

  if (!videoPath) {
    throw new ApiError(404, "Video path not found");
  }
  const video = await uploadOnCloudinary(videoPath, "video");

  const video_object = {
    title: title,
    description: description ?? null,
    video_url: video.url,
    course_id: course_object.course_id,
  };

  const created_video = await video_model.create(video_object);

  if (created_video) {
    return res
      .status(201)
      .json(new ApiResponse(201, created_video, "video created successfully"));
  } else {
    throw new ApiError(500, "Something went wrong while creating video");
  }
});

const getVideo = asyncHandler(async (req, res) => {
  const videos = await video_model.findAll();

  return res
    .status(201)
    .json(new ApiResponse(201, videos, "video fetched successfully"));
});

const getVideoByCourse = asyncHandler(async (req, res) => {
  const { courseTitle } = req.params;
  const course_object = await course_model.findOne({
    where: { title: courseTitle },
  });

  if (!course_object) {
    throw new ApiError(404, "course not found");
  }

  const videos = await video_model.findAll({
    where: { course_id: course_object.course_id },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, videos, "video fetched successfully by course"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { courseTitle, videoTitle } = req.params;
  const { title, description } = req.body;
  const videoPath = req.file?.path;

  const course_object = await course_model.findOne({
    where: { title: courseTitle },
  });

  const video_object = await video_model.findOne({
    where: { title: videoTitle, course_id: course_object.course_id },
  });

  if (!video_object) {
    throw new ApiError(404, "video not found");
  }
  let video;
  if (videoPath) {
    video = await uploadOnCloudinary(videoPath, "video");
  }

  if (title) video_object.title = title;
  if (description) video_object.description = description;
  if (video) video_object.video_url = video.url;

  await video_object.save();

  const updated_video = await video_model.findByPk(video_object.video_id);

  if (updated_video) {
    return res
      .status(201)
      .json(new ApiResponse(201, updated_video, "video updated successfully"));
  } else {
    throw new ApiError(500, "Something went wrong while updating video");
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { courseTitle, videoTitle } = req.params;
  const course_object = await course_model.findOne({
    where: { title: courseTitle },
  });

  const video_object = await video_model.findOne({
    where: { title: videoTitle, course_id: course_object.course_id },
  });

  if (!video_object) {
    throw new ApiError(404, "video not found");
  }
  const deleted_video = await video_object.destroy();

  if (deleted_video) {
    return res
      .status(201)
      .json(new ApiResponse(201, deleted_video, "video deleted successfully"));
  } else {
    return res
      .status(500)
      .json(new ApiError(500, "Internal server error while deleting video"));
  }
});

export { addVideo, getVideo, getVideoByCourse, updateVideo, deleteVideo };
