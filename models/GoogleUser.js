const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    default: 'student',
    // required: true,
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

module.exports = mongoose.model('GoogleUser', UserSchema);
