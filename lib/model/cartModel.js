// Importing mongoose
const mongoose = require("mongoose");

const constants = require('../constants');

const Schema = mongoose.Schema;

const CartSchema = new Schema({
    employeeId: {
        type: Schema.Types.ObjectId,
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: constants.DB_MODEL_REF.PRODUCT,
    }],
    quantity: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model(constants.DB_MODEL_REF.CART, CartSchema);