var express = require('express');
var router = express.Router({ mergeParams: true });
const middleware = require('../middleware');
const passport = require('passport');
const bcrypt = require('bcrypt');
import Users from '../models/user';

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
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    res.redirect('/login');
  } catch {
    res.redirect('/register');
  }
  console.log(users);
});
router.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
});

module.exports = router;
