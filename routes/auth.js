const express = require('express');
const passport = require('passport');
const crypto = require('crypto');
const validator = require('validator');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

const userService = require('../config/user')(User);

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
  console.log('validationErrors');

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

router.post('/signup', async (req, res, next) => {
  const { username, email, password } = req.body;

  if (password.length < 8) {
    req.flash(
      'error',
      'Account not created. Password must be 7+ characters long'
    );
    return res.redirect('/local/signup');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await userService.addLocalUser({
      username,
      email,
      password: hashedPassword,
    });
  } catch (e) {
    req.flash(
      'error',
      'Error creating a new account. Try a different login method.'
    );
    return res.redirect('/signup');
  }

  console.log('redirect to dash');
  return res.redirect('/dashboard');
});

// @desc Auth with Google
// @route GET /auth/google

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
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
