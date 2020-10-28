const mongoose = require('mongoose');
const constants = require('../constants');

const Schema = mongoose.Schema;

const ContactUsQuerySchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    mobileNo: {
        type: Number,
    },
    comment: {
        type: String,
        required: true,
    },
    repliedMessage: {
        type: String,
    },
    isReplied: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model(constants.DB_MODEL_REF.CONTACT_US_QUERY, ContactUsQuerySchema);
