const express = require('express');

const Courses = require('./../models/CourseModel');
const GoogleUser = require('../models/User');

const router = express.Router();

// @desc Get single course
// @route GET /:id

router.get('/', (req, res) => {
  const user = GoogleUser.find(res.locals.user);
  res.status(200).json({
    status: 'success',
    data: {
      data: user,
    },
  });
});

module.exports = router;
