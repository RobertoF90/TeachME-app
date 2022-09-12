const express = require('express');
const homeworkController = require('../controllers/homeworkController');
const homework = require('../models/HomeworkModel');

const router = express.Router();

// @desc Get all homework
// @route GET /

router.get('/', homeworkController.getAllHomework);

router.post('/create/newHomework', homeworkController.createHomework);

module.exports = router;
