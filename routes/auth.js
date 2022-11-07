const express = require('express');
const passport = require('passport');
const router = express.Router();

const authController = require('../controllers/authController');

router.post('/login', authController.login);

router.post('/signup', authController.signup);

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

router.get('/logout', authController.logout);

module.exports = router;
