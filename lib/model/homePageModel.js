// Importing mongoose
const mongoose = require("mongoose");

const constants = require('../constants');

const Schema = mongoose.Schema;

const HomePageSchema = new Schema({
    
    carousel: [{
        image: {
            type: String,
        },
        title: {
            type: String
        },
        description: {
            type: String,
        }
    }],
    card: [{
        image: {
            type: String
        },
        title: {
            type: String
        },
        description: {
            type: String
        }
    }],

}, {
    timestamps: true,
});

module.exports = mongoose.model(constants.DB_MODEL_REF.HOMEPAGE, HomePageSchema);