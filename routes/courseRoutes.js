const express = require('express');

const Courses = require('./../models/CourseModel');
const User = require('../models/User');

const router = express.Router();

// @desc Get all courses
// @route GET /

// router.get('/', async (req, res) => {
//   // GET all the courses available
//   const courses = await Courses.find();

//   res.status(200).json({
//     status: 'success',
//     data: courses,
//   });
// });

// @desc Get enrolled courses
// @route GET /

router.get('/', async (req, res) => {
  console.log('top of course routes');

  // GET all the courses available
  const courses = await Courses.find();

  // Get the the enrolled courses of the user
  const enrolledCourses = await User.findById(res.locals.user.id).populate({
    path: 'courses',
  });

  res.render('courses', {
    userId: res.locals.user.id,
    availableCourses: courses,
    enrolledCourses: enrolledCourses.courses,
  });
});

// @desc Render create page
// @route GET /courses/create

router.get('/create', async (req, res) => {
  console.log('create page?');
  const students = await User.find();
  const courses = await Courses.find();

  res.render('teacherCreate', {
    students,
    courses,
  });
});

// @desc Create new course
// @route /courses/create/newcourse

router.post('/create/newcourse', async (req, res) => {
  console.log(req.body);
  try {
    await Courses.create(req.body);
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }
});

// @desc Get single course
// @route GET /:id

router.get('/:id', async (req, res) => {
  console.log('req.params.id');
  const course = await Courses.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    course,
  });
});

// @desc Enroll course
// @route PATCH enroll/:id

router.patch('/enroll/:id', async (req, res) => {
  console.log('request received');
  try {
    await Courses.findOneAndUpdate(
      { _id: req.params.id },
      { students: res.locals.user.id },
      {
        new: true,
        runValidators: true,
      }
    );
    await User.findOneAndUpdate(
      { _id: res.locals.user.id },
      { courses: req.params.id },
      {
        new: true,
        runValidators: true,
      }
    );

    console.log('success');
    res.status(200).json({
      status: 'success',
    });
  } catch (error) {
    console.log('error enrollment');
  }
});

// @desc Leave course
// @route PATCH leave/:id
// @note User ref are not removed from course array

router.patch('/leave/:id', async (req, res) => {
  try {
    await GoogleUser.updateOne(
      { _id: res.locals.user.id },
      {
        $pull: { courses: req.params.id },
      }
    );
    res.status(200).json({
      status: 'success',
    });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
