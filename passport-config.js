const { authenticate } = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = await getUserByEmail(email);

    // Check and see if the password fields match

    // Check and see if there is a user with that email
    if (user == null) {
      // if we were connecting to server the first arg below would be error, not null
      // 2nd arg return user that you found, in this case you didn't find one. so false.
      return done(null, false, { message: 'No user with that email' });
    }
    try {
      console.log(user);
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Password incorrect' });
      }
    } catch (e) {
      return done(e);
    }
  };

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
      },
      authenticateUser
    )
  );
  // Serialize user to store in the session
  passport.serializeUser((user, done) => done(null, user.id));
  // deserialize user as a single id
  passport.deserializeUser(async (id, done) => {
    return done(null, await getUserById(id));
  });
}

module.exports = initialize;
