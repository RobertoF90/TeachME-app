const Homework = require('../models/HomeworkModel');
const User = require('../models/User');

exports.getAllHomework = async (req, res, next) => {
  try {
    const homework = await Homework.find();

    res.status(200).json({
      data: {
        data: homework,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getOneHomework = async (req, res) => {
  try {
    const user = res.locals.user;
    const homework = await Homework.find({ _id: req.params.id });

    res.status(200).json({
      data: {
        data: homework,
      },
    });

  } catch (err) {
    console.log(err);
  }
};

exports.createHomework = async (req, res, next) => {
  try {
    console.log(req.body);
    await Homework.create({
      title: req.body.title,
      type: req.body.type,
      course: req.body.course,
      student: req.body.student,
    });
    res.status(200).redirect('/dashboard');
  } catch (err) {
    console.error(err);
  }
};
