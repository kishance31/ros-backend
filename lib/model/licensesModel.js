// Importing mongoose
const mongoose = require("mongoose");

const constants = require('../constants');

const Schema = mongoose.Schema;

const LicenseSchema = new Schema(
    {
        type: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);



module.exports = mongoose.model(constants.DB_MODEL_REF.LICENSES, LicenseSchema);