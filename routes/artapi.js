const router = require('express').Router();

const { loginCheck } = require('./middlewares');

const ArtApi = require('../art-api');
const artApi = new ArtApi();

router.get('/', loginCheck(), (req, res, next) => {
  artApi
    .getRandoms()
    .then((arts) => res.render('artapi/', { arts }))
    .catch((error) => console.log(error));
});
router.post('/', loginCheck(), (req, res, next) => {
  const { q } = req.body;
  if (q) {
    artApi
      .getSearch(q)
      .then((arts) => res.render('artapi/', { arts, q }))
      .catch((error) => console.log(error));
  } else {
    artApi
      .getRandoms()
      .then((arts) => res.render('artapi/', { arts }))
      .catch((error) => console.log(error));
  }
});
router.get('/art/:id', loginCheck(), (req, res, next) => {
  artApi
    .getArt(req.params.id)
    .then((art) => res.render('artapi/show', { art }))
    .catch((error) => console.log(error));
});

module.exports = router;
