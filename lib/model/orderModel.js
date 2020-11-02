// Importing mongoose
const mongoose = require("mongoose");

const constants = require('../constants');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    corporateId: {
        type: Schema.Types.ObjectId,
        ref: constants.DB_MODEL_REF.USER,
    },
    address: {
        type: Schema.Types.Mixed,
    },
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: constants.DB_MODEL_REF.USER,
    },
    orderId: {
        type: String,
        required: true,
        index: { unique: true },
    },
    invoiceNo: {
        type: String,
        // required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "confirmed"]
    },
    deliveryStatus: {
        type: String,
        required: true,
    },
    orderDate: {
        type: Date
    },
    dispatchDate: {
        type: Date
    },
    deliveryDate: {
        type: Date
    },
    products: [{
        type: Schema.Types.Mixed,
    }],
    quantity: {
        type: Number,
        default: 1
    },
    paypalDetails: [Schema.Types.Mixed],
    isFirstTimePayment: {
        type: Boolean,
        default: false,
    },
    firstPaymentTerm: {
        type: Number,
        required: true,
    },
    recurringPaymentPending: {
        type: Number,
        required: true,
    },
    recurringMonthsNo: {
        type: Number,
        required: true,
    },
    orderConfirmDate: {
        type: Date,
    },
    firstTimeCost: {
        type: Number,
        required: true,
    },
    recurringCost: {
        type: Number,
        required: true,
    },
    totalOrderCost: {
        type: Number,
        required: true,
    },
    firstYearCharge: {
        type: Number,
        required: true,
    },
    firstYearTerm: {
        type: Number,
        required: true,
    },
    secondYearCharge: {
        type: Number,
        required: true,
    },
    secondYearTerm: {
        type: Number,
        required: true,
    },
    pendingFirstYearTerm: {
        type: Number,
        required: true,
    },
    pendingSecondYearTerm: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model(constants.DB_MODEL_REF.ORDER, OrderSchema);