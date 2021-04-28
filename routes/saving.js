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
      Art.findOneOrCreate({ artId: art.artId }, art)
        .then((createdArt) => {
          console.log('THEN', createdArt);

          BookMark.findOneOrCreate({
            user: req.user._id,
            art: createdArt._id,
          })
            .then(() => res.redirect('/bookmark'))
            .catch((error) => console.log(error));
        })
        .catch((error) => {
          console.log('CATCH', error);
          res.redirect('/bookmark');
        });
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
