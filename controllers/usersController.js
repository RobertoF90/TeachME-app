const User = require('../models/User');

exports.getStudent = async (req, res) => {
  const user = await User.find({ _id: req.params.id }).populate({
    path: 'homework',
  });
  res.status(200).json({
    status: 'success',
    data: {
      data: user,
    },
  });
};

exports.changeToTeacher = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.body.student },
      {
        role: 'teacher',
      }
    );
    req.flash('success', { msg: `${user.username} is now a teacher!` });
    res.status(200).redirect('/profile');
  } catch (err) {
    console.log(err);
  }
};

exports.changeToStudent = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.body.teacher },
      {
        role: 'student',
      }
    );
    req.flash('success', { msg: `${user.username} is now a student!` });
    res.status(200).redirect('/profile');
  } catch (err) {
    console.log(err);
  }
};
