const mongoose = require('mongoose');
const constants = require('../constants');

const Schema = mongoose.Schema;

const SocialMediaLinkModel = new Schema({
    facebook: {
        type: String,
        required: true,
    },
    instagram: {
        type: String,
        required: true,
    },
    pinterest: {
        type: String,
        required: true,
    },
    google: {
        type: String,
        required: true,
    },
    twitter: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model(constants.DB_MODEL_REF.SOCIAL_MEDIA, SocialMediaLinkModel);
