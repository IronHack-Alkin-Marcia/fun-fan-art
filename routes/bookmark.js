const router = require('express').Router();
const User = require('../models/Users');
const Art = require('../models/Art');
const BookMark = require('../models/BookMark');

const { loginCheck } = require('./middlewares');

router.get('/', loginCheck(), (req, res, next) => {
  Promise.all([
    BookMark.find({ user: req.user._id })
      .distinct('tag')
      .then((tags) => tags),
    BookMark.find({ user: req.user._id })
      .populate('art')
      .then((bookmarks) => bookmarks),
  ])
    .then(([tags, bookmarks]) => res.render('bookmark/', { bookmarks, tags }))
    .catch((err) => next(err));
});

router.get('/tags/:tag', loginCheck(), (req, res, next) => {
  let queryval = req.params.tag == '0' ? null : req.params.tag;
  let subtitle =
    req.params.tag == '0'
      ? 'Your art not tagged'
      : `Your art tagged as "${req.params.tag}"`;

  BookMark.find({ user: req.user._id, tag: queryval })
    .populate('art')
    .then((bookmarks) => res.render('bookmark/tagged', { bookmarks, subtitle }))
    .catch((err) => next(err));
});

router.get('/:id', loginCheck(), (req, res, next) => {
  Promise.all([
    BookMark.find({ user: req.user._id })
      .distinct('tag')
      .then((tags) => tags),
    BookMark.findById(req.params.id)
      .populate('art')
      .then((bookmark) => bookmark),
  ])
    .then(([tags, bookmark]) => res.render('bookmark/show', { bookmark, tags }))
    .catch((err) => next(err));
});

router.get('/:id/delete', loginCheck(), (req, res, next) => {
  BookMark.findByIdAndDelete(req.params.id)
    .then(() => res.redirect('/bookmark'))
    .catch((err) => res.redirect('/bookmark'));
});
module.exports = router;
