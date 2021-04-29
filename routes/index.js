const router = require('express').Router();
const Art = require('../models/Art');

/* GET home page */
router.get('/', (req, res, next) => {
  Art.count().exec((err, count) => {
    const random = Math.floor(Math.random() * count);
    Art.findOne()
      .skip(random)
      .exec((err, art) => res.render('index', { art }));
  });
});

module.exports = router;
