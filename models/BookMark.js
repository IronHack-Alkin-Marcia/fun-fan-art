const { Schema, model } = require('mongoose');

const bookMarkSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    art: {
      type: Schema.Types.ObjectId,
      ref: 'Art',
    },
    comments: String,
  },
  {
    timestamps: true,
  }
);

const BookMark = model('BookMark', bookMarkSchema);

module.exports = BookMark;
