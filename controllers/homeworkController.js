const Homework = require("../models/HomeworkModel");
const User = require("../models/User");
const Courses = require("./../models/CourseModel");

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
    // ASSIGN HOMEWORK TO EACH STUDENT IN A COURSE

    const assignTo = req.body.assignTo;
    const course = await Courses.findById(req.body.course).populate({
      path: "students",
    });

    if (assignTo === "Everyone") {
      const students = course.students;
      students.forEach(async (student) => {
        try {
          await Homework.create({
            type: req.body.type,
            title: req.body.title,
            task: req.body.task,
            course: req.body.course,
            student: student._id,
          });
        } catch (err) {
          console.log(err);
        }
      });
    } else if (Array.isArray(assignTo)) {
      const students = course.students.filter((student) =>
        assignTo.includes(student.id)
      );
      students.forEach(async (student) => {
        try {
          await Homework.create({
            type: req.body.type,
            title: req.body.title,
            task: req.body.task,
            course: req.body.course,
            student: student._id,
          });
        } catch (err) {
          console.log(err);
        }
      });
    } else {
      // ASSIGN HOMEWORK TO ONLY ONE STUDENT
      await Homework.create({
        type: req.body.type,
        title: req.body.title,
        task: req.body.task,
        course: req.body.course,
        student: req.body.assignTo,
      });
    }
    res.status(200).redirect("/dashboard");
  } catch (err) {
    console.error(err);
  }
};

exports.deliverHomework = async (req, res) => {
  try {
    console.log("delivering");
    await Homework.findByIdAndUpdate(
      req.params.id,
      {
        body: req.body.body,
        status: "Delivered",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
};

exports.checkHomework = async (req, res) => {
  try {
    await Homework.findByIdAndUpdate(
      req.params.id,
      {
        body: req.body.body,
        status: "Checked",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
};
