// Importing mongoose
const mongoose = require("mongoose");

const constants = require('../constants');

const Schema = mongoose.Schema;

const LicenseCountSchema = new Schema({
    corporateId: {
        type: String,
        required: true,
    },
    licenses: [{
        _id: Schema.Types.ObjectId,
        count: Number,
        randomLicenseId: [{
            type: String,
        }]
    }]
}, { strict: false, timestamps: true });

module.exports = mongoose.model(constants.DB_MODEL_REF.LICENSE_COUNT, LicenseCountSchema);