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
                        .catch((error) => res.redirect('/bookmark'));
                })
                .catch((error) => res.redirect('/bookmark'));
        })
        .catch((error) => res.redirect('/bookmark'));
});

router.post('/bookmark/:id/savenote', (req, res, next) => {
    const { comment } = req.body;
    console.log(comment);
    BookMark.findByIdAndUpdate(req.params.id, { $push: { comments: comment } })
        .then((thisIsForLog) => {
            console.log(thisIsForLog);
            res.redirect('/bookmark');
        })
        .catch(err => {
            next(err);
        });
});

router.post('/bookmark/:id/deletenote', (req, res, next) => {
    const { noteNum } = req.body;
    BookMark.findByIdAndUpdate({ cn: req.params.name }, { $pullAll: { uid: [req.params.deleteUid] } })
        .then(() => {
            res.redirect('/bookmark');
        })
        .catch(err => {
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