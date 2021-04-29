const passport = require('passport');
const bcrypt = require('bcrypt');

const User = require('../models/Users');
const LocalStrategy = require('passport-local').Strategy;

module.exports = (app) => {
  passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username })
        .then((user) => {
          if (user === null) {
            return done(null, false, { message: 'Wrong Credentials' });
          } else if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false, { message: 'Wrong Credentials' });
          } else {
            return done(null, user);
          }
        })
        .catch((err) => {
          return done(err);
        });
    })
  );
};
