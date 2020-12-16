// Importing mongoose
const mongoose = require("mongoose");

const constants = require('../constants');

const Schema = mongoose.Schema;

const PurchasedLicenseSchema = new Schema({
    corporateId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    orderId: {
        type: String,
        required: true,
    },
    paypalDetails: Schema.Types.Mixed,
    randomLicenseId:[{
        type: String,
    }],
    purchasedLicenses: [{
        quantity: {
            type: Number,
            required: true,
        },
        licenseId: {
            type: Schema.Types.ObjectId,
            ref: constants.DB_MODEL_REF.LICENSES,
        },
        totalPrice: {
            type: Number,
            required: true,
        }
    }],
    isActive: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model(constants.DB_MODEL_REF.PURCHASE_LICENSE, PurchasedLicenseSchema);