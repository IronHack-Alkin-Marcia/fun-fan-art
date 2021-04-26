const router = require('express').Router();

const { loginCheck } = require('./middlewares');

const ArtApi = require('../art-api');
const artApi = new ArtApi();

router.get('/', loginCheck(), (req, res, next) => {
  res.send('this is only a test page');
});

router.get('/randoms', loginCheck(), (req, res, next) => {
  artApi
    .getRandoms()
    .then((art) => res.send(art))
    .catch((error) => console.log(error));
});

router.get('/random', loginCheck(), (req, res, next) => {
  artApi
    .getRandom()
    .then((art) => res.send(art))
    .catch((error) => console.log(error));
});

router.get('/random/:id', loginCheck(), (req, res, next) => {
  artApi
    .getRandom(req.params.id)
    .then((art) => res.send(art))
    .catch((error) => console.log(error));
});
router.get('/art/:id', loginCheck(), (req, res, next) => {
  artApi
    .getArt(req.params.id)
    .then((art) => res.send(art))
    .catch((error) => console.log(error));
});

module.exports = router;
