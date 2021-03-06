const mongoose = require('mongoose');
const constants = require('../constants');

const Schema = mongoose.Schema;

const ContactUsSchema = new Schema({

    contact: {
        type: String
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