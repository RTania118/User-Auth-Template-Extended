var express = require('express');
var router = express.Router({ mergeParams: true });
const middleware = require('../middleware');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// Routes
router.get('/', middleware.checkAuthenticated, (req, res) => {
  res.render('index');
});

router.get('/login', middleware.checkNotAuthenticated, (req, res) => {
  res.render('login');
});

router.post(
  '/login',
  middleware.checkNotAuthenticated,
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

router.get('/register', middleware.checkNotAuthenticated, (req, res) => {
  res.render('register');
});

router.post('/register', middleware.checkNotAuthenticated, async (req, res) => {
  const password = req.body.password;
  const password2 = req.body.password2;

  // Check and see if the password fields match
  if (password != password2) {
    next(new Error('Passwords do not match'));
    res.redirect('/register');
  }

  // If passwords do match, continue
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = {
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    };
    let user = new User(newUser);
    await user.save();
    await passport.authenticate('local')(req, res, function () {
      req.flash('success', `Welcome ${user.name}`);
      res.redirect('/login');
    });
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      req.flash('error', `That email is already taken!`);
    }
    console.log(err);
    res.redirect('/register');
  }
});

router.get('/logout', (req, res) => {
  req.logOut();
  req.flash(
    'success',
    'You have been successfully logged out. Visit again soon!'
  );
  res.redirect('/login');
});

module.exports = router;
