const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // id: {
  //   type: Number,
  //   required: true,
  // },
  username: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Please insert your email address'],
    unique: [true, 'Email already registered'],
  },
  password: String,

  displayName: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  image: {
    type: String,
  },

  role: {
    type: String,
    default: 'student',
    // required: true,
  },
  source: {
    type: String,
    required: [true, 'source required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  courses: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Course',
      active: true,
    },
  ],
  homework: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Homework',
      status: {
        type: String,
        default: 'incomplete',
      },
    },
  ],
});

module.exports = mongoose.model('User', UserSchema);
