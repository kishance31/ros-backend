const mongoose = require('mongoose');
const constants = require('../constants');

const Schema = mongoose.Schema;

const ContactUsSchema = new Schema({

    // name :{type:String,enum:[constants.CMS.aboutUs,constants.CMS.contactUs],required:true,unique:true},

    contact: {
        type: Number
    },
    email: {
        type: String,
    },
    address:{
        type:String
    }
    
}, {
    timestamps: true,
})

module.exports = mongoose.model(constants.DB_MODEL_REF.CONTACTUS, ContactUsSchema);