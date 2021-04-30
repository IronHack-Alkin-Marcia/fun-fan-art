const router = require('express').Router();

const Art = require('../models/Art');
const BookMark = require('../models/BookMark');

const { loginCheck } = require('./middlewares');

router.get('/', loginCheck(), (req, res, next) => {
  /* NOT A GOOD VERSION BUT OUT OF TIME */
  Promise.all([
    Art.find().then((arts) => arts),
    BookMark.find()
      .populate('user')
      .then((bookmarks) => bookmarks),
  ])
    .then(([arts, bookmarks]) => {
      for (let ind in arts) {
        arts[ind].userList = [];
        let tagList = [];
        for (let bookmark of bookmarks) {
          if (String(arts[ind]._id) == String(bookmark.art._id)) {
            arts[ind].userList.push({
              fullName: bookmark.user.fullName,
              _id: bookmark.user._id,
            });
            if (bookmark.tag) {
              tagList.push(bookmark.tag);
            }
          }
        }
        if (tagList) {
          arts[ind].tagList = [...new Set(tagList)];
        }
      }
      res.render('collection/', { arts });
    })
    .catch((err) => next(err));
});

module.exports = router;
