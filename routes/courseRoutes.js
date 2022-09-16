const express = require('express');
const coursesController = require('../controllers/coursesController');
const Courses = require('./../models/CourseModel');
const User = require('../models/User');

const router = express.Router();

// @desc Get All courses
// @route GET /

router.get('/', coursesController.getAllCourses);

// @desc Create new course
// @route /courses/create/newcourse

router.post('/create/newcourse', coursesController.createCourse);

// @desc Get single course
// @route GET /:id

router.get('/:id', coursesController.getOneCourse);

// @desc Create new Homework
// @route get :id/newHomework

// @desc Enroll course
// @route get :id/enroll

router.get('/:id/enroll', coursesController.enrollCourse);

// @desc Leave course
// @route PATCH leave/:id
// @note User ref are not removed from course array

router.patch('/leave/:id', coursesController.leaveCourse);

module.exports = router;
