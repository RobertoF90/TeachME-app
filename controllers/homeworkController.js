const Homework = require('../models/HomeworkModel');
const User = require('../models/User');

exports.getAllHomework = (req, res, next) => {};

exports.createHomework = async (req, res, next) => {
  try {
    console.log(req.body);
    await Homework.create({
      title: req.body.title,
      type: req.body.type,
      course: req.body.course,
      student: req.body.student,
    });

    // let homework = await Homework.find();
    // homework = homework[homework.length - 1];
    // console.log(homework);

    // await User.findOneAndUpdate(
    //   { _id: res.locals.user.id },
    //   { courses: req.params.id },
    //   {
    //     new: true,
    //     runValidators: true,
    //   }
    // );

    // await User.findOneAndUpdate(
    //   { _id: req.body.student },
    //   {
    //     $push: {
    //       homework: homework._id,
    //     },
    //   },
    //   {
    //     new: true,
    //   }
    // );

    res.status(200).redirect('/dashboard');
  } catch (err) {
    console.error(err);
  }
};
