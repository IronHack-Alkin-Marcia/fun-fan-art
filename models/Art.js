const { Schema, model } = require('mongoose');

const artSchema = new Schema(
  {
    artId: {
      type: String,
      unique: true,
    },
    museumapi: String,
    title: String,
    artist: String,
    smallDescription: String,
    description: String,
    img: String,
    imgWidth: Number,
    imgHeight: Number,
    year: Number,
  },
  {
    timestamps: true,
  }
);

const Art = model('Art', artSchema);

module.exports = Art;
