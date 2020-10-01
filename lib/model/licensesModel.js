// Importing mongoose
const mongoose = require("mongoose");

const constants = require('../constants');

const Schema = mongoose.Schema;

const LicenseSchema = new Schema(
    {
        type: {
            type: String,
            required: true,
            index: { unique: true },
        },
        price: {
            type: Number,
            required: true,
        },
        active: {
            type: Boolean,
            default: true,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(constants.DB_MODEL_REF.LICENSES, LicenseSchema);