const router = require('express').Router();
const User = require('../models/Users');
const Art = require('../models/Art');
const BookMark = require('../models/BookMark');

const { loginCheck } = require('./middlewares');

const ArtApi = require('../art-api');
const artApi = new ArtApi();

router.get('/saveart/:id', loginCheck(), (req, res, next) => {
  artApi
    .getArt(req.params.id)
    .then((art) => {
      Art.create(art)
        .then((createdArt) => {
          BookMark.create({
            user: req.user._id,
            art: createdArt._id,
          })
            .then((_) => res.redirect('/private/bookmark'))
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
});

module.exports = router;

/*
{
        artId,
        title,
        artist,
        smallDescription,
        description,
        img,
        imgWidth,
        imgHeight,
        year,
        museumapi,
      }
*/
