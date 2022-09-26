const express = require('express');
const { ensureAuth, ensureGuest } = require('./../middleware/auth');
const router = express.Router();

const viewsController = require('../controllers/viewsController');
// @desc Login page
// @route GET /

router.get('/', ensureGuest, viewsController.login);

// @desc Signup page
// @route GET /signup

router.get('/signup', ensureGuest, viewsController.signup);

// @desc Dashboard
// @route GET /dashboard

router.get('/dashboard', ensureAuth, viewsController.getDashboard);

router.get('/profile', ensureAuth, viewsController.getUserProfile);

router.get('/courses/create', ensureAuth, viewsController.getCreateCourse);
router.get('/courses/enroll', ensureAuth, viewsController.enrollCourses);

router.get('/users/:id', ensureAuth, viewsController.getStudentHomeworkPage);

router.get('/courses/:id', ensureAuth, viewsController.getCoursePage);

router.get('/courses/:id/newHomework', viewsController.getCreateHomework);

router.get('/homework/:id', viewsController.getHomeworkPage);

module.exports = router;
