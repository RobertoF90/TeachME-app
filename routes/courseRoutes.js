const express = require('express');
const coursesController = require('../controllers/coursesController');

const router = express.Router();

router.get('/', coursesController.getAllCourses);

router.post('/create/newcourse', coursesController.createCourse);

router.get('/:id', coursesController.getOneCourse);

router.get('/:id/enroll', coursesController.enrollCourse);

router.patch('/leave/:id', coursesController.leaveCourse);

module.exports = router;
