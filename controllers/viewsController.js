const User = require("../models/User");
const Courses = require("./../models/CourseModel");
const Homework = require("../models/HomeworkModel");
const formatText = require("../helpers/formatText");
const moment = require("moment");

exports.login = (req, res) => {
  res.render("login");
};

exports.signup = (req, res) => {
  res.render("signup");
};

exports.getDashboard = async (req, res) => {
  // Check if user is student or teacher
  const username = res.locals.user.username;

  if (res.locals.user.role === "student") {
    const courses = await Courses.find({
      students: res.locals.user.id,
    });

    const user = await User.findById(res.locals.user.id).populate({
      path: "homework",
    });

    res.render("studentDash", {
      formatText,
      username,
      userImg: res.locals.user.img,
      courses,
      user,
    });
  } else {
    const courses = await Courses.find({
      teacher: res.locals.user.id,
    }).populate({
      path: "students",
      populate: { path: "homework" },
    });

    res.render("teacherDash", {
      username,
      courses,
    });
  }
};

exports.getStudentHomeworkPage = async (req, res) => {
  try {
    const username = res.locals.user.username;

    const courses = await Courses.find({
      teacher: res.locals.user.id,
    });

    const student = await User.findById(req.params.id).populate({
      path: "homework",
    });

    res.render("teacherStudentPage", {
      username,
      formatText,
      courses,
      student,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.enrollCourses = async (req, res) => {
  try {
    const username = res.locals.user.username;

    const enrolled = await Courses.find({ _id: res.locals.user.id });
    const courses = await Courses.find().populate({ path: "students" });

    res.render("courseEnroll", {
      username,
      enrolled,
      courses,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getCreateHomework = async (req, res) => {
  try {
    const username = res.locals.user.username;

    const courses = await Courses.find();
    const course = await Courses.findById({ _id: req.params.id }).populate({
      path: "students",
    });
    res.render("teacherNewHomework", {
      username,
      courses,
      course,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getCreateCourse = async (req, res) => {
  const username = res.locals.user.username;

  const students = await User.find();
  const courses = await Courses.find().populate({
    path: "students",
  });

  res.render("teacherNewCourse", {
    username,
    students,
    courses,
  });
};

exports.getCoursePage = async (req, res) => {
  const username = res.locals.user.username;
  if (res.locals.user.role === "teacher") {
    const courses = await Courses.find({
      teacher: res.locals.user.id,
    }).populate({
      path: "students",
      populate: { path: "homework" },
    });

    const course = await Courses.findOne({
      _id: req.params.id,
      teacher: res.locals.user.id,
    }).populate({
      path: "students",
      populate: { path: "homework" },
    });

    res.render("teacherCoursePage", {
      username,
      moment,
      formatText,
      courses,
      course,
    });
  } else {
    const courses = await Courses.find({
      students: res.locals.user.id,
    }).populate({
      path: "students",
      populate: { path: "homework" },
    });

    const course = await Courses.findOne({
      students: res.locals.user.id,
    }).populate({
      path: "students",
      populate: { path: "homework" },
    });

    const student = await User.findById(res.locals.user.id).populate({
      path: "homework",
    });

    res.render("studentCoursePage", {
      username,
      formatText,
      courses,
      course,
      student,
    });
  }
};

exports.getHomeworkPage = async (req, res) => {
  const username = res.locals.user.username;
  const homework = await Homework.findById(req.params.id);
  let courses;
  if (res.locals.user.role === "teacher") {
    courses = await Courses.find({
      teacher: res.locals.user.id,
    });

    res.render("teacherHomeworkPage", {
      username,
      courses,
      homework,
    });
  } else {
    courses = await Courses.find({
      students: res.locals.user.id,
    });

    res.render("studentHomeworkPage", {
      username,
      courses,
      homework,
    });
  }
};
