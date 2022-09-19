const express = require('express');

const Courses = require('./../models/CourseModel');
const User = require('../models/User');
const Homework = require('../models/HomeworkModel');

const router = express.Router();

// @desc Get single course
// @route GET /:id

router.get('/:id', async (req, res) => {
  const user = await User.find({ _id: req.params.id }).populate({
    path: 'homework',
  });

  res.status(200).json({
    status: 'success',
    data: {
      data: user,
    },
  });
});

module.exports = router;
