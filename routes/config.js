const router = require('express').Router();
const User = require('../models/Users');
const Art = require('../models/Art');
const bcrypt = require('bcrypt');

const { isAdmin, isEditor } = require('./middlewares');

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

router.post('/adduser', isAdmin(), (req, res, next) => {
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

router.get('/:id/plus', isAdmin(), (req, res, next) => {
  res.render('blank');
});
router.get('/:id/minus', isAdmin(), (req, res, next) => {
  res.render('blank');
});
router.get('/:id/delete', isAdmin(), (req, res, next) => {
  res.render('blank');
});

module.exports = router;
