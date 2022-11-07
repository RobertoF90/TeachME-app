const passport = require('passport');
const validator = require('validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const userService = require('../config/user')(User);

exports.login = (req, res, next) => {
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

  passport.authenticate('local', (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('errors', { msg: 'Your email or password is wrong!' });
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
      req.flash('success', { msg: `Welcome back ${user.username}!` });
      res.redirect('/dashboard');
    });
  })(req, res, next);
};

exports.signup = async (req, res, next) => {
  const { username, email, password, role } = req.body;

  if (password.length < 8) {
    req.flash('errors', {
      msg: 'Account not created. Password must be 7+ characters long',
    });
    return res.redirect('/signup');
  }

  const newUser = await User.find({ email });

  if (newUser.length > 0) {
    req.flash('errors', { msg: 'An account with this email already exists' });
    return res.redirect('/signup');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await userService.addLocalUser({
      username,
      email,
      password: hashedPassword,
      role,
    });
  } catch (e) {
    req.flash(
      'errors',
      'Error creating a new account. Try a different login method.'
    );
    return res.redirect('/signup');
  }

  passport.authenticate('local', (err, user) => {
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
      res.redirect('/dashboard');
    });
  })(req, res, next);
};

exports.logout = async (req, res, next) => {
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
};
