const express = require('express');
const { ensureAuth, ensureGuest } = require('./../middleware/auth');
const router = express.Router();
const User = require('../models/User');
const Courses = require('./../models/CourseModel');
const Homework = require('../models/HomeworkModel');
// @desc Login page
// @route GET /

router.get('/', ensureGuest, (req, res) => {
  res.render('login');
});

// @desc Signup page
// @route GET /signup

router.get('/signup', ensureGuest, (req, res) => {
  res.render('signup');
});

// @desc Dashboard
// @route GET /dashboard

router.get('/dashboard', ensureAuth, async (req, res) => {
  // Check if user is student or teacher
  const username = res.locals.user.name || res.locals.user.username;

  console.log(res.locals.user);
  if (res.locals.user.role === 'student') {
    // Get all enrolled courses
    // DUPLICATE in courseRoutes
    const enrolledCourses = await User.findById({
      _id: res.locals.user.id,
    }).populate({
      path: 'courses',
    });
    // console.log(res.locals.user);
    res.render('studentDash', {
      username: username,
      userImg: res.locals.user.img,
      enrolledCourses: enrolledCourses.courses,
    });
  } else {
    const courses = await Courses.find({
      teacher: res.locals.user.id,
    }).populate({
      path: 'students',
      populate: { path: 'homework' },
    });

    // const course = await courses[0].populate({
    //   path: 'students',
    // });
    // const homework = await Homework.find().populate({
    //   path: 'students',
    // });

    // const students = await User.find({
    //   course:
    // })

    console.log(courses[0].students[0].homework);

    // res.status(200).json({
    //   data: {
    //     data: courses,
    //   },
    // });

    res.render('teacherDash', {
      userName: username,
      courses,
      // course,
    });
  }
});

module.exports = router;
