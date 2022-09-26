const Course = require('../models/CourseModel');
const User = require('../models/User');

exports.getAllCourses = async (req, res, next) => {
  try {
    // GET all the courses available
    const courses = await Course.find();

    res.status(200).json({
      data: {
        data: courses,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getOneCourse = async (req, res) => {
  try {
    const courses = await Course.find();
    const course = await Course.findById({ _id: req.params.id }).populate({
      path: 'students',
    });
    const students = await User.find();
    res.status(200).json({
      status: 'success',
      data: {
        data: students,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.createCourse = async (req, res) => {
  try {
    await Course.create({
      title: req.body.title,
      teacher: res.locals.user.id,
    });

    res.redirect('/dashboard');
  } catch (err) {
    console.log(err);
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate({
      path: 'students',
      select: 'id',
    });

    if (course.students.some((student) => res.locals.user.id === student.id)) {
      console.log('already enrolled');
      req.flash('errors', { msg: 'You are already enrolled in this course' });

      return res.status(200).redirect('/dashboard');
    }

    await Course.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { students: res.locals.user.id } },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).redirect('/dashboard');
  } catch (err) {
    console.log(err);
  }
};

exports.leaveCourse = async (req, res) => {
  try {
    await User.updateOne(
      { _id: res.locals.user.id },
      {
        $pull: { courses: req.params.id },
      }
    );
    res.status(200).json({
      status: 'success',
    });
  } catch (error) {
    console.error(error);
  }
};
