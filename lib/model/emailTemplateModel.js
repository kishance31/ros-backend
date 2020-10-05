const mongoose = require('mongoose');
const constants = require('../constants');

const Schema = mongoose.Schema;

const EmailTemplateSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    subject: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model(constants.DB_MODEL_REF.EMAIL_TEMPLATE, EmailTemplateSchema);