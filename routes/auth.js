const express = require('express');
const passport = require('passport');
const validator = require('validator');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');



const userService = require('../config/user')(User);

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
    req.logIn(user, async (err) => {
      if (err) {
        return next(err);
      }
      await User.findOneAndUpdate(
        { _id: user.id },
        {
          lastOnline: Date.now(),
        }
      );
      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect(req.session.returnTo || '/dashboard');
    });
  })(req, res, next);
});


router.post('/signup', async (req, res, next) => {
  const { username, email, password, role } = req.body;

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
      role,
    });
  } catch (e) {
    req.flash(
      'error',
      'Error creating a new account. Try a different login method.'
    );
    return res.redirect('/signup');
  }


  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
  
    req.logIn(user, async (err) => {
      if (err) {
        return next(err);
      }
      await User.findOneAndUpdate(
        { _id: user.id },
        {
          lastOnline: Date.now(),
        }
      );
      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect(req.session.returnTo || '/dashboard');
    });
  })(req, res, next);
});


router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
  }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

router.get('/logout', async (req, res, next) => {
  // UPDATE LAST ONLINE
  await User.findOneAndUpdate(
    { _id: res.locals.user.id },
    {
      lastOnline: Date.now(),
    }
  );

  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect('/');
  });
});

module.exports = router;
