// Importing mongoose
const mongoose = require("mongoose");

const constants = require('../constants');

const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({
    corporateId: {
        type: Schema.Types.ObjectId,
        ref: constants.DB_MODEL_REF.USER,
    },
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: constants.DB_MODEL_REF.USER,
    },
    orderId: {
        type: String,
        required: true,
        index: {unique: true},
    },
    
    firstInvoiceDate: {
        type: Date
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: constants.DB_MODEL_REF.PRODUCT,
    }],
    quantity: {
        type: Number,
        default: 1
    },
    invoiceDetails: [
        new Schema({
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
            paypalDetails: Schema.Types.Mixed,
            paymentDone: {
                type: Boolean
            }
        })
    ],
    firstPaymentTerm: {
        type: Number,
        required: true,
    },
    recurringPaymentPending: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model(constants.DB_MODEL_REF.invoice, InvoiceSchema);