// Importing mongoose
const mongoose = require("mongoose");

const constants = require('../constants');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    corporateId: {
        type: Schema.Types.ObjectId,
        ref: constants.DB_MODEL_REF.USER,
    },
    address:{
        type:String
    },
    employeeId:{
        type: Schema.Types.ObjectId,
        ref: constants.DB_MODEL_REF.USER,
    },
    orderId: {
        type: String,
        required: true,
    },
    invoiceNo: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    deliveryStatus: {
        type: String,
        required: true,
    },
    dispatchDate:{
        type:Date
    },
    deliveryDate:{
        type:Date
    },
    products: [{
       
        type: Schema.Types.ObjectId,
        ref: constants.DB_MODEL_REF.PRODUCT,
    },
    
],

    quantity:{
    type:Number,
    default:1
}
}, {
    timestamps: true,
});

module.exports = mongoose.model(constants.DB_MODEL_REF.ORDER, OrderSchema);