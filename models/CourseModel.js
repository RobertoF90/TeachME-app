const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  students: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
});

module.exports = mongoose.model('Course', CourseSchema);
