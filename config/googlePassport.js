const GoogleStrategy = require('passport-google-oauth20');
const mongoose = require('mongoose');
const User = require('../models/GoogleUser');

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        };
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );

  // passport.serializeUser(function (user, cb) {
  //   console.log(user);
  //   process.nextTick(function () {
  //     cb(null, {
  //       id: user.id,
  //       username: user.displayName,
  //       name: user.firstName,
  //       role: user.role,
  //     });
  //   });
  // });

  // passport.deserializeUser(function (user, cb) {
  //   process.nextTick(function () {
  //     return cb(null, user);
  //   });
  // });
};
