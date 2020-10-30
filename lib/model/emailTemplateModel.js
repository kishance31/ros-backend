const mongoose = require('mongoose');
const constants = require('../constants');

const Schema = mongoose.Schema;

const EmailTemplateSchema = new Schema({
    title: {
        type: String,
        require: true,
        index: { unique: true }
    },
    subject: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model(constants.DB_MODEL_REF.EMAIL_TEMPLATE, EmailTemplateSchema);