const router = require('express').Router();

const Art = require('../models/Art');

const { loginCheck } = require('./middlewares');

router.get('/', loginCheck(), (req, res, next) => {
  Art.find()
    .then((arts) => res.render('collection/', { arts }))
    .catch((err) => next(err));
});

module.exports = router;
