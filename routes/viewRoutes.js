const express = require('express');
const { ensureAuth, ensureGuest } = require('./../middleware/auth');
const router = express.Router();
const User = require('../models/User');
const Courses = require('./../models/CourseModel');
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
      userName: username,
      userImg: res.locals.user.img,
      enrolledCourses: enrolledCourses.courses,
    });
  } else {
    const students = await User.find();
    const courses = await Courses.find();
    // console.log(students);

    res.render('teacherDash', {
      userName: username,
      students,
      courses,
    });
  }
});

module.exports = router;
