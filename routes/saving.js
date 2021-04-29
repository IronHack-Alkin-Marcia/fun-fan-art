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
          BookMark.findOneOrCreate({
            user: req.user._id,
            art: createdArt._id,
          })
            .then(() => res.redirect('/bookmark'))
            .catch((error) => next(error));
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});

router.post('/bookmark/:id/savenote', (req, res, next) => {
  const { comment } = req.body;
  BookMark.findByIdAndUpdate(req.params.id, { $push: { comments: comment } })
    .then(() => res.redirect(`/bookmark/${req.params.id}`))
    .catch((err) => next(err));
});

router.post('/bookmark/:id/deleteBookMark', (req, res, next) => {
  BookMark.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect('/bookmark');
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/bookmark/:id/deletenote', (req, res, next) => {
  const { noteText } = req.body;
  BookMark.findByIdAndUpdate(req.params.id, {
    $pullAll: { comments: [noteText] },
  })
    .then(() => {
      res.redirect(`/bookmark/${req.params.id}`);
    })
    .catch((err) => {
      next(err);
    });
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
