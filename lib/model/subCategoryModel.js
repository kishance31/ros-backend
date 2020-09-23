// Importing mongoose
const mongoose = require("mongoose");

const constants = require('../constants');

const Schema = mongoose.Schema;

let SubCategory;

const SubCategorySchema = Schema({
    // id will be auto generated
  
    category_id: {
        type:mongoose.Schema.Types.ObjectId
    },
    status:{
        type:Boolean,
        default:true
    },
    subcategory_name: {
        type: String,
    }
   },
  {
    timestamps: true
  });

//Export user module
SubCategory = module.exports = mongoose.model(constants.DB_MODEL_REF.SUBCATEGORY, SubCategorySchema);
