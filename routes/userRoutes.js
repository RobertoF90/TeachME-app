const express = require('express');

const Courses = require('./../models/CourseModel');
const User = require('../models/User');
const Homework = require('../models/HomeworkModel');

const router = express.Router();

router.get('/becomeTeacher', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      {
        _id: res.locals.user.id,
      },
      {
        role: 'teacher',
      }
    );
    req.user.role = 'teacher';
    req.flash('success', { msg: `You are now a teacher!` });
    res.status(200).redirect('/profile');
  } catch (err) {
    console.log(err);
  }
});

router.post('/promoteToTeacher', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.body.student },
      {
        role: 'teacher',
      }
    );

    req.flash('success', { msg: `${user.username} is now a teacher!` });

    console.log('user promoted to teacher');

    res.status(200).redirect('/profile');
  } catch (err) {
    console.log(err);
  }
});

router.post('/promoteToStudent', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.body.teacher },
      {
        role: 'student',
      }
    );

    req.flash('success', { msg: `${user.username} is now a student!` });

    console.log('user promoted to student');

    res.status(200).redirect('/profile');
  } catch (err) {
    console.log(err);
  }
});

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
