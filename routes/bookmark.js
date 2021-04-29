const router = require('express').Router();
const User = require('../models/Users');
const Art = require('../models/Art');
const BookMark = require('../models/BookMark');

const { loginCheck } = require('./middlewares');

router.get('/', loginCheck(), (req, res, next) => {
  BookMark.find({ user: req.user._id })
    .populate('art')
    .then((bookmark) => res.render('bookmark/', { bookmark }))
    .catch((error) => next(error));
});

router.get('/:id', loginCheck(), (req, res, next) => {
  BookMark.findById(req.params.id)
    .populate('art')
    .then((bookmark) => res.render('bookmark/show', { bookmark }))
    .catch((error) => next(error));
});

router.get('/:id/delete', loginCheck(), (req, res, next) => {
  BookMark.findByIdAndDelete(req.params.id)
    .then(() => res.redirect('/bookmark'))
    .catch((err) => res.redirect('/bookmark'));
});
module.exports = router;
