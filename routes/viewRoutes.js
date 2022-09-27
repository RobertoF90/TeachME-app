const express = require('express');
const { ensureAuth, ensureGuest } = require('./../middleware/auth');
const router = express.Router();
const viewsController = require('../controllers/viewsController');

router.get('/', ensureGuest, viewsController.login);

router.get('/signup', ensureGuest, viewsController.signup);

router.get('/dashboard', ensureAuth, viewsController.getDashboard);

router.get('/profile', ensureAuth, viewsController.getUserProfile);

router.get('/courses/create', ensureAuth, viewsController.getCreateCourse);

router.get('/courses/enroll', ensureAuth, viewsController.enrollCourses);

router.get('/users/:id', ensureAuth, viewsController.getStudentHomeworkPage);

router.get('/courses/:id', ensureAuth, viewsController.getCoursePage);

router.get('/courses/:id/newHomework', viewsController.getCreateHomework);

router.get('/homework/:id', viewsController.getHomeworkPage);

module.exports = router;
