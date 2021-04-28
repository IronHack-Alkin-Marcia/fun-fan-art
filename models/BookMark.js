const { Schema, model } = require('mongoose');

const bookMarkSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    art: {
        type: Schema.Types.ObjectId,
        ref: 'Art',
    },
    comments: [String],
}, {
    timestamps: true,
});

bookMarkSchema.static(
    'findOneOrCreate',
    async function findOneOrCreate({ art, user }) {
        const one = await this.findOne({ art, user });

        return one || this.create({ art, user });
    }
);

const BookMark = model('BookMark', bookMarkSchema);

module.exports = BookMark;