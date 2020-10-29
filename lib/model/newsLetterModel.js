const mongoose = require('mongoose');
const constants = require('../constants');

const Schema = mongoose.Schema;

const NewsLetterSchema = new Schema({
    email: {
        type: String,
        required: true,
        index: { unique: true }
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model(constants.DB_MODEL_REF.NEWS_LETTER, NewsLetterSchema);
