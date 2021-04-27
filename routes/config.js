const router = require('express').Router();
const User = require('../models/Users');
const bcrypt = require('bcrypt');

const { isAdmin, isEditor } = require('./middlewares');

const ArtApi = require('../art-api');
const artApi = new ArtApi();

router.get('/', isEditor(), (req, res, next) => {
  res.render('webconfig/');
});
router.get('/artcheck', isEditor(), (req, res, next) => {
  res.render('blank');
});

router.get('/users', isAdmin(), (req, res, next) => {
  User.find()
    .then((users) => res.render('webconfig/users', { users }))
    .catch((err) => next(err));
});
router.get('/adduser', isAdmin(), (req, res, next) => {
  res.render('webconfig/adduser');
});

router.post('/adduser', (req, res, next) => {
  const { username, role, email, fullName } = req.body;
  User.findOne({ username }).then((user) => {
    if (user !== null) {
      res.render('webconfig/adduser', {
        message: 'This username is already taken',
      });
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync('funfanart', salt);
      User.create({
        username,
        email,
        fullName,
        role,
        password: hash,
      }).then(() => res.redirect('/webconfig'));
    }
  });
});

module.exports = router;
