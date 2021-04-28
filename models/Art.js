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

artSchema.static(
  'findOneOrCreate',
  async function findOneOrCreate(condition, art) {
    const one = await this.findOne(condition);

    return one || this.create(art);
  }
);

const Art = model('Art', artSchema);

module.exports = Art;
