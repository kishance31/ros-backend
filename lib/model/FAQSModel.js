const mongoose = require('mongoose');
const constants = require('../constants');

const Schema = mongoose.Schema;

const FaQSSchema = new Schema({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model(constants.DB_MODEL_REF.FAQS, FaQSSchema);
