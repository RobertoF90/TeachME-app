const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // id: {
  //   type: Number,
  //   required: true,
  // },
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
});

module.exports = mongoose.model('User', UserSchema);
