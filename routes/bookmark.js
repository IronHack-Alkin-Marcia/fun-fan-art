const router = require('express').Router();
const User = require('../models/Users');
const Art = require('../models/Art');
const BookMark = require('../models/BookMark');

const { loginCheck } = require('./middlewares');

router.get('/', loginCheck(), (req, res, next) => {
  BookMark.find({ user: req.user._id })
    .populate('art')
    .then((bookmark) => {
      console.log('bookmark', bookmark);
      res.render('bookmark/', { bookmark });
    })
    .catch((error) => console.log(error));
});

module.exports = router;
