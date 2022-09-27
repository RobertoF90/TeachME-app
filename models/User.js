const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
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
    lastOnline: {
      type: Date,
      default: new Date(),
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.virtual('homework', {
  ref: 'Homework',
  foreignField: 'student',
  localField: '_id',
});

module.exports = mongoose.model('User', UserSchema);
