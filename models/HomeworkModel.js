const mongoose = require("mongoose");

const homeworkSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
  body: {
    type: String,
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: "Course",
  },
  student: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    default: "not completed",
  },
});

module.exports = mongoose.model("Homework", homeworkSchema);
