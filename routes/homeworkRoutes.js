const express = require('express');
const homeworkController = require('../controllers/homeworkController');
const homework = require('../models/HomeworkModel');

const router = express.Router();

// @desc Get all homework
// @route GET /

router.get('/', homeworkController.getAllHomework);

router.post('/create', homeworkController.createHomework);

router.post('/:id/deliver', homeworkController.deliverHomework);

router.get('/:id', homeworkController.getOneHomework);

module.exports = router;
