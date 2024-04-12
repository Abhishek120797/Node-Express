import { video_model } from "./video.model.js";
import { assignment_model } from "./assignment.model.js";
import { course_model } from "./course.model.js";
import { course_category } from "./courseCategory.model.js";

course_model.hasMany(video_model, {
  foreignKey: "course_id",
  onDelete: "CASCADE",
});

course_model.hasMany(assignment_model, {
  foreignKey: "course_id",
  onDelete: "CASCADE",
});

video_model.belongsTo(course_model, {
  foreignKey: "course_id",
  onDelete: "CASCADE",
});

assignment_model.belongsTo(course_model, {
  foreignKey: "course_id",
  onDelete: "CASCADE",
});

course_model.belongsTo(course_category, {
  foreignKey: "category_id",
});

course_category.hasMany(course_model, {
  foreignKey: "category_id",
});

export { course_model, video_model, assignment_model, course_category };
