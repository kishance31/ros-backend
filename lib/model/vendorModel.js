// Importing mongoose
const mongoose = require("mongoose");

const constants = require('../constants');

const Schema = mongoose.Schema;

const VendorSchema = new Schema({
   
    fullName:{
        type: String,
    },
   
    email:{
        type:String,
        default:1
    },
    contact:{
        type:Number,
        default:1
    },
    isActive:{
        type:Boolean,
        default:true
    }

}, {
    timestamps: true,
});

module.exports = mongoose.model(constants.DB_MODEL_REF.VENDOR, VendorSchema);