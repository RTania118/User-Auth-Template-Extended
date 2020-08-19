const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
});

UserSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', UserSchema);
