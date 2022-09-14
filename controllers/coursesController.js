const Course = require('../models/CourseModel');
const User = require('../models/User');

exports.getAllCourses = async (req, res, next) => {
  try {
    // GET all the courses available
    const courses = await Course.find();

    // Get the the enrolled courses of the user
    // const enrolledCourses = await User.findById(res.locals.user.id).populate({
    //   path: 'courses',
    // });

    // res.render('courseEnroll', {
    //   userId: res.locals.user.id,
    //   availableCourses: courses,
    //   enrolledCourses: enrolledCourses.courses,
    // });

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
  if (res.locals.user.role === 'student') {
    res.status(200).json({
      status: 'not implemented',
    });
  }

  if (res.locals.user.role === 'teacher') {
    // const students = await User.find();
    const courses = await Course.find();
    const course = await Course.findById({ _id: req.params.id }).populate({
      path: 'students',
    });
    const students = await User.find();
    // .populate({
    //   path: 'courses',
    // })

    // .exec();

    console.log(students);

    res.status(200).json({
      status: 'success',
      data: {
        data: students,
      },
    });

    // res.render('coursePage', {
    //   students,
    //   courses,
    //   course,
    // });
  }
};

exports.createCourse = async (req, res) => {
  console.log(req.body);
  try {
    await Course.create({
      title: req.body.title,
      teacher: res.locals.user.id,
    });
    // res.redirect('/dashboard');
    console.log('course created');
  } catch (error) {
    console.log(error);
  }
};

exports.newHomework = async (req, res) => {
  try {
    const courses = await Course.find();
    const course = await Course.findById({ _id: req.params.id }).populate({
      path: 'students',
    });
    res.render('teacherNewHomework', {
      // students,
      courses,
      course,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.enrollCourse = async (req, res) => {
  console.log('request received');
  try {
    await Course.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { students: res.locals.user.id } },
      {
        new: true,
        runValidators: true,
      }
    );
    await User.findOneAndUpdate(
      { _id: res.locals.user.id },
      { $push: { courses: req.params.id } },
      {
        new: true,
        runValidators: true,
      }
    );

    console.log('success');
    res.status(200).redirect('/dashboard');
  } catch (error) {
    console.log('error enrollment');
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
