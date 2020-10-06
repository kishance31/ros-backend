const mongoose = require('mongoose');
const constants = require('../constants');

const Schema = mongoose.Schema;

const AboutUsSchema = new Schema({

    // name :{type:String,enum:[constants.CMS.aboutUs,constants.CMS.contactUs],required:true,unique:true},

    aboutUsImage: {
        type: String
    },
    description: {
        type: String,
    },
    
}, {
    timestamps: true,
})

module.exports = mongoose.model(constants.DB_MODEL_REF.ABOUTUS, AboutUsSchema);