const User = require('../models/User');
const Courses = require('./../models/CourseModel');
const Homework = require('../models/HomeworkModel');
const formatText = require('../helpers/formatText');

exports.login = (req, res) => {
  res.render('login');
};

exports.signup = (req, res) => {
  res.render('signup');
};

exports.getDashboard = async (req, res) => {
  // Check if user is student or teacher
  const username = res.locals.user.name || res.locals.user.username;

  if (res.locals.user.role === 'student') {
    const courses = await Courses.find({
      students: res.locals.user.id,
    }).populate({
      path: 'students',
      populate: { path: 'homework' },
    });
    res.render('studentDash', {
      formatText,
      username: username,
      userImg: res.locals.user.img,
      courses,
    });
  } else {
    const courses = await Courses.find({
      teacher: res.locals.user.id,
    }).populate({
      path: 'students',
      populate: { path: 'homework' },
    });

    res.render('teacherDash', {
      userName: username,
      courses,
    });
  }
};

exports.enrollCourses = async (req, res) => {
  try {
    const enrolled = await Courses.find({ _id: res.locals.user.id });
    const courses = await Courses.find().populate({ path: 'students' });

    res.render('courseEnroll', {
      enrolled,
      courses,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getCreateHomework = async (req, res) => {
  try {
    const courses = await Courses.find();
    const course = await Courses.findById({ _id: req.params.id }).populate({
      path: 'students',
    });
    res.render('teacherNewHomework', {
      // students,
      courses,
      course,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getCreateCourse = async (req, res) => {
  const students = await User.find();
  const courses = await Courses.find().populate({
    path: 'students',
  });

  res.render('teacherNewCourse', {
    students,
    courses,
  });
};

exports.getCoursePage = async (req, res) => {
  const courses = await Courses.find({
    students: res.locals.user.id,
  }).populate({
    path: 'students',
    populate: { path: 'homework' },
  });

  const course = await Courses.findOne({
    students: res.locals.user.id,
  }).populate({
    path: 'students',
    populate: { path: 'homework' },
  });

  res.render('studentCoursePage', {
    formatText,
    courses,
    course,
  });
};

exports.getHomeworkPage = async (req, res) => {
  let courses;
  if (res.locals.user.role === 'teacher') {
    courses = await Courses.find({
      teacher: res.locals.user.id,
    });
  } else {
    courses = await Courses.find({
      students: res.locals.user.id,
    });
  }

  const homework = await Homework.findById(req.params.id);

  res.render('homeworkPage', {
    courses,
    homework,
  });
};
