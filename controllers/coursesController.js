const Course = require('../models/CourseModel');
const Homework = require('../models/HomeworkModel');

const User = require('../models/User');

exports.getAllCourses = async (req, res) => {
  try {
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
    const course = await Course.findById({ _id: req.params.id }).populate({
      path: 'students',
    });
    res.status(200).json({
      status: 'success',
      data: {
        data: course,
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
      req.flash('errors', { msg: 'You have already enrolled in this course' });
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
    console.log(req.body)
    await Course.updateOne(
      { _id: req.body.course },
      {
        $pull: { students: res.locals.user.id },
      }
    );
    res.status(200).redirect('/profile')
  } catch (error) {
    console.error(error);
  }
};

exports.deleteCourse =  async  (req, res) => {
  try {
    await Homework.deleteMany({course: req.body.course}) 

      await Course.deleteOne({ _id: req.body.course})
      res.redirect('/profile')
  } catch (err) {
      console.log(err)
  }
}