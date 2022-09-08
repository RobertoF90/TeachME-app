const express = require('express');
const passport = require('passport');
const crypto = require('crypto');
const validator = require('validator');
const router = express.Router();
const LocalUser = require('../models/LocalUser');

// @desc Local Auth login
// @route GET /auth/login

router.post('/login', (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: 'Please enter a valid email address.' });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: 'Password cannot be blank.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/');
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });
  console.log(validationErrors);

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('errors', info);
      return res.redirect('/');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect(req.session.returnTo || '/dashboard');
    });
  })(req, res, next);
});

// @desc Local Auth signup
// @route POST /auth/signup

router.post('/signup', (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: 'Please enter a valid email address.' });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: 'Password must be at least 8 characters long',
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: 'Passwords do not match' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('../signup');
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  const user = new LocalUser({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  });

  LocalUser.findOne(
    { $or: [{ email: req.body.email }, { userName: req.body.userName }] },
    (err, existingUser) => {
      if (err) {
        return next(err);
      }
      if (existingUser) {
        req.flash('errors', {
          msg: 'Account with that email address or username already exists.',
        });
        return res.redirect('../signup');
      }
      user.save((err) => {
        if (err) {
          return next(err);
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          res.redirect('/dashboard');
        });
      });
    }
  );
});

// @desc Auth with Google
// @route GET /auth/google

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile '],
  })
);

// @desc Google auth callback
// @route GET /auth/google/callback

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
  }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// @desc Logout user
// @route GET /auth/logout

router.get('/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect('/');
  });
});

module.exports = router;
