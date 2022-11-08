const User = require('../models/User');
const Courses = require('./../models/CourseModel');
const Homework = require('../models/HomeworkModel');
const formatText = require('../helpers/formatText');
const moment = require('moment');

exports.login = (req, res) => {
  res.render('login');
};

exports.signup = (req, res) => {
  res.render('signup');
};

exports.getUserProfile = async (req, res) => {
  const username = res.locals.user.username;
  if (res.locals.user.role === 'teacher') {
    const courses = await Courses.find({
      teacher: res.locals.user.id,
    });

    const users = await User.find();
    let students = users.filter((user) => user.role !== 'teacher');
    let teachers = users.filter((user) => user.role === 'teacher');
    teachers = teachers.filter((user) => user.id !== res.locals.user.id);

    const user = await User.findById(res.locals.user.id);

    const homework = await Homework.find({
      course: courses,
    });
    res.render('profilePage', {
      formatText,
      username,
      userImg: res.locals.user.img,
      courses,
      students,
      teachers,
      homework,
      user,
    });
  } else {
    const courses = await Courses.find({
      students: res.locals.user.id,
    });
    const user = await User.findById(res.locals.user.id).populate({
      path: 'homework',
    });

    res.render('profilePage', {
      formatText,
      username,
      userImg: res.locals.user.img,
      courses,
      user,
    });
  }
};

exports.getDashboard = async (req, res) => {
  const username = res.locals.user.username;

  if (res.locals.user.role === 'student') {
    const courses = await Courses.find({
      students: res.locals.user.id,
    });

    const user = await User.findById(res.locals.user.id).populate({
      path: 'homework',
    });

    res.render('studentDash', {
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
      path: 'students',
      populate: { path: 'homework' },
    });

    res.render('teacherDash', {
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
      path: 'homework',
      populate: { path: 'course' },
    });

    res.render('teacherStudentPage', {
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
    const enrolled = await Courses.find({ students: res.locals.user.id });
    const courses = await Courses.find().populate({ path: 'students' });

    res.render('courseEnroll', {
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
    const courses = await Courses.find({ teacher: res.locals.user.id });
    const course = await Courses.findById({ _id: req.params.id }).populate({
      path: 'students',
    });
    res.render('teacherNewHomework', {
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
  const courses = await Courses.find({ teacher: res.locals.user.id }).populate({
    path: 'students',
  });

  res.render('teacherNewCourse', {
    username,
    students,
    courses,
  });
};

exports.getCoursePage = async (req, res) => {
  try {
    const username = res.locals.user.username;
    if (res.locals.user.role === 'teacher') {
      const courses = await Courses.find({
        teacher: res.locals.user.id,
      }).populate({
        path: 'students',
        populate: { path: 'homework' },
      });

      const course = await Courses.findOne({
        _id: req.params.id,
        teacher: res.locals.user.id,
      }).populate({
        path: 'students',
        populate: { path: 'homework' },
      });

      res.render('teacherCoursePage', {
        username,
        moment,
        formatText,
        courses,
        course,
      });
    } else {
      const courses = await Courses.find({
        students: res.locals.user.id,
      });

      const course = await Courses.findById({ _id: req.params.id }).populate({
        path: 'students',
      });

      const student = await User.findById(res.locals.user.id).populate({
        path: 'homework',
      });

      res.render('studentCoursePage', {
        username,
        formatText,
        courses,
        course,
        student,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getHomeworkPage = async (req, res) => {
  const username = res.locals.user.username;
  const homework = await Homework.findById(req.params.id);
  let courses;
  if (res.locals.user.role === 'teacher') {
    courses = await Courses.find({
      teacher: res.locals.user.id,
    });

    res.render('teacherHomeworkPage', {
      username,
      courses,
      homework,
    });
  } else {
    courses = await Courses.find({
      students: res.locals.user.id,
    });

    res.render('studentHomeworkPage', {
      username,
      courses,
      homework,
    });
  }
};
