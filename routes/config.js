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
      }).then(() => res.redirect('/webconfig/users'));
    }
  });
});

const roleChange = (role, direction) => {
  const roles = ['USER', 'EDITOR', 'ADMIN'];
  const curIndex = roles.indexOf(role);
  const newInex = curIndex + direction;
  if (curIndex >= 0 && newInex >= 0 && newInex < roles.length) {
    return roles[newInex];
  }
  return false;
};

const doUpdateRole = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      let direction = req.path.substr(-4, 4) == 'plus' ? 1 : -1;
      let newRole = roleChange(user.role, direction);
      if (newRole) {
        User.findByIdAndUpdate(user._id, { role: newRole }).then(() =>
          res.redirect('/webconfig/users')
        );
      } else {
        res.redirect('/webconfig/users');
      }
    })
    .catch((err) => res.redirect('/webconfig/users'));
};

router.get('/:id/plus', isAdmin(), doUpdateRole);
router.get('/:id/minus', isAdmin(), doUpdateRole);
router.get('/:id/delete', isAdmin(), (req, res, next) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.redirect('/webconfig/users'))
    .catch((err) => res.redirect('/webconfig/users'));
});

module.exports = router;
