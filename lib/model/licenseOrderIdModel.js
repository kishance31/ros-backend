"use strict";

// Importing mongoose
const mongoose = require("mongoose");

const constants = require('../constants');

const Schema = mongoose.Schema;

const LicenseOrderIdSchema = new Schema({
    corporateId: {
        type: String,
        required: true,
    },
    orderId: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model(constants.DB_MODEL_REF.LICENSE_ORDER_ID, LicenseOrderIdSchema);