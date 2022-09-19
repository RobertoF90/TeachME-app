const GoogleStrategy = require('passport-google-oauth20');
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const passport = require('passport');
const userService = require('./user')(User);

module.exports = function () {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          id: profile.id,
          email: profile.emails[0].value,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
          source: 'google',
        };
        try {
          let user = await userService.getUserByEmail({ email: newUser.email });

          if (!user) {
            user = await userService.addGoogleUser({
              id: newUser.id,
              email: newUser.email,
              displayName: newUser.displayName,
              firstName: newUser.firstName,
              lastName: newUser.lastName,
              image: newUser.image,
            });
            return done(null, user);
          }

          if (user.source != 'google') {
            return done(null, false, {
              message:
                'You have previously signed up with a different signin method',
            });
          }

          return done(null, user);
        } catch (err) {
          console.error(err);
        }
      }
    )
  );

  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        const user = await userService.getUserByEmail({ email });

        if (!user) {
          return done(null, false, {
            message: `User with email ${email} does not exist`,
          });
        }

        if (user.source != 'local') {
          return done(null, false, {
            message: `You have previously signed up with a different signin method`,
          });
        }
        console.log('user', user);
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: `Incorrect password provided` });
        }

        return done(null, user);
      }
    )
  );

  passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
      cb(null, {
        id: user.id,
        name: user.firstName,
        username: user.username,
        img: user.image,
        role: user.role,
        enrolledCourses: user.courses,
      });
    });
  });

  passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });
};
