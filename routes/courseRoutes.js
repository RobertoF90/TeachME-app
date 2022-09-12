const express = require('express');
const coursesController = require('../controllers/coursesController');
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

router.get('/', coursesController.getAllCourses);

// @desc Render create page
// @route GET /courses/create

router.get('/create', async (req, res) => {
  const students = await User.find();
  const courses = await Courses.find().populate({
    path: 'students',
  });

  console.log(students);
  console.log(courses);

  res.render('teacherCreate', {
    students,
    courses,
  });
});

// @desc Create new course
// @route /courses/create/newcourse

router.post('/create/newcourse', coursesController.createCourse);

// @desc Get single course
// @route GET /:id

router.get('/:id', coursesController.getOneCourse);

// @desc Enroll course
// @route PATCH enroll/:id

router.get('/:id/enroll', coursesController.enrollCourse);

// @desc Leave course
// @route PATCH leave/:id
// @note User ref are not removed from course array

router.patch('/leave/:id', coursesController.leaveCourse);

module.exports = router;
