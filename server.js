if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  bodyParser = require('body-parser'),
  passport = require('passport'),
  flash = require('express-flash'),
  session = require('express-session'),
  methodOverride = require('method-override'),
  expressLayouts = require('express-ejs-layouts');

const User = require('./models/user');

const initializePassport = require('./passport-config');
initializePassport(
  passport,
  (email) => User.findOne({ email: email }),
  (id) => User.findById(id)
);

app.set('view engine', 'ejs');
// body parser is needed to parse the req body!
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Database Connection
mongoose.connect(
  process.env.DATABASE_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  () => {
    console.log('Connected to database');
  }
);

// function inside passport itself which has all basics for us
app.use(passport.initialize());
// makes variables consistent across entire session that you have
app.use(passport.session());
app.use(methodOverride('_method'));

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.warning = req.flash('warning');
  next();
});

app.use('/', require('./routes/index'));

// Port
app.listen(process.env.PORT || 3000, () => {
  console.log('Connected to port...');
});
