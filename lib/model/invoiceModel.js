// Importing mongoose
const mongoose = require("mongoose");

const constants = require('../constants');

const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({
    corporateId: {
        type: Schema.Types.ObjectId,
        ref: constants.DB_MODEL_REF.USER,
    },
    employeeId: [{
        type: Schema.Types.ObjectId,
        ref: constants.DB_MODEL_REF.USER,
    }],
    orderId: [{
        type: String,
    }],
    firstInvoiceDate: {
        type: Date
    },
    orderDate: [{
        type: Date,
    }],
    // products: [{
    //     type: Schema.Types.Mixed,
    // }],
    invoiceNo: {
        type: String,
        required: true,
    },
    isReccuring: {
        type: Boolean,
        default: false,
    },
    invoiceDate: {
        type: Date,
    },
    // paypalDetails: Schema.Types.Mixed,
    paymentDone: {
        type: Boolean
    },
    paymentDate: {
        type: Date,
    },
    firstTimeCost: {
        type: Number,
    },
    recurringCost: {
        type: Number,
    },
    totalOrderCost: {
        type: Number,
    },
    currentTimeStamp: {
        type: Number
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model(constants.DB_MODEL_REF.invoice, InvoiceSchema);